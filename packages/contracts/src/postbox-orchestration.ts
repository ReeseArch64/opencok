import type { Fields } from "@opencok/messages/sfs";
import type { MailListCommand, MailSaveMode } from "./mail";

export interface PostboxCommands
{
    mailStatus(uid: string, params: Fields): Promise<Fields>;
    mailSave(uid: string, mode: MailSaveMode, params: Fields): Promise<Fields>;
    mailRead(uid: string, batch: boolean, params: Fields): Promise<Fields>;
    mailDelete(uid: string, params: Fields): Promise<Fields>;
    mailSystem(uid: string, params: Fields, legacy?: boolean): Promise<Fields>;
    mailUpdates(uid: string, params: Fields): Promise<Fields>;
    mailBatch(uid: string, params: Fields, command: MailListCommand): Promise<Fields>;
}
