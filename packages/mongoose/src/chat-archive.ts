import { MongoClient } from "mongodb";
import type { ChatArchiveMessage, ChatArchiveStore } from "@opencok/contracts/chat-delivery";

interface Document extends ChatArchiveMessage {
  deleted?: boolean;
  _id: number;
  expiry: Date;
}

export function createChatArchiveStore(uri: string, now = Date.now): ChatArchiveStore {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 1500,
    connectTimeoutMS: 1500,
    socketTimeoutMS: 2500,
    maxPoolSize: 5,
  });
  const collection = client.db().collection<Document>("chat_archive");
  let indexes: Promise<unknown> | undefined;
  const initialize = () =>
    (indexes ??= collection
      .createIndexes([
        { key: { expiry: 1 }, name: "chat_archive_expiry", expireAfterSeconds: 0 },
        { key: { roomId: 1, sequenceId: -1 }, name: "chat_archive_room_sequence" },
      ])
      .catch((error) => {
        indexes = undefined;

        throw error;
      }));

  return {
    async put(message) {
      await client.connect();
      await initialize();

      if (message.expiresAt <= now()) return;

      const old = await collection.findOne({ _id: message.sequenceId });

      if (old && old.version > message.version) return;

      if (
        old &&
        old.version === message.version &&
        (old.hash !== message.hash || old.expiresAt !== message.expiresAt)
      )
        throw new Error("Archive content conflict");

      try {
        await collection.replaceOne(
          { _id: message.sequenceId, version: { $lte: message.version } },
          { ...message, expiry: new Date(message.expiresAt) },
          { upsert: true },
        );
      } catch (error) {
        const existing = await collection.findOne({ _id: message.sequenceId });

        if (
          !existing ||
          existing.version < message.version ||
          !(error && typeof error === "object" && "code" in error && error.code === 11000)
        )
          throw error;
      }
    },
    async getMany(ids) {
      await client.connect();
      const rows = await collection.find({ _id: { $in: ids } }).toArray();

      return rows
        .filter((row) => !row.deleted)
        .map(({ _id: _sequence, expiry: _expiry, ...message }) => message);
    },
    async get(sequenceId) {
      await client.connect();
      const row = await collection.findOne({ _id: sequenceId });

      if (!row || row.deleted) return null;

      const { _id: _sequence, expiry: _expiry, ...message } = row;

      return message;
    },
    async remove(sequenceId) {
      await client.connect();
      await initialize();
      const expiry = now() + 7 * 86_400_000;
      await collection.updateOne(
        { _id: sequenceId },
        {
          $set: {
            version: Number.MAX_SAFE_INTEGER,
            deleted: true,
            body: "",
            hash: "",
            roomId: "",
            senderUid: "",
            idempotencyKey: "",
            createdAt: new Date(now()).toISOString(),
            archiveAt: now(),
            expiresAt: expiry,
            expiry: new Date(expiry),
            sequenceId,
          },
        },
        { upsert: true },
      );
    },
    async purge(now) {
      await client.connect();
      await collection.deleteMany({ expiry: { $lte: new Date(now) } });
    },
    async close() {
      await client.close();
    },
  };
}
