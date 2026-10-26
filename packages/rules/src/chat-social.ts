import { ChatCommandError } from "@opencok/errors/chat";
export function contactTransition(
  command: string,
  own: number,
  other: number,
): readonly [number, number] {
  switch (command) {
    case "contact.apply":
      if (own === 4 && other === 3) return [1, 1];
      if (own !== 0 || other !== 0) throw new ChatCommandError("contact_exists");
      return [3, 4];
    case "contact.accept":
      if (own !== 4 || other !== 3) throw new ChatCommandError("invalid_contact");
      return [1, 1];
    case "contact.delete":
      return [0, 0];
    case "contact.favo":
      if (own !== 1 && own !== 2) throw new ChatCommandError("invalid_contact");
      return [2, other];
    case "contact.favo.cancel":
      if (own !== 1 && own !== 2) throw new ChatCommandError("invalid_contact");
      return [1, other];
    case "contact.desc":
      if (own === 0) throw new ChatCommandError("invalid_contact");
      return [own, other];
    default:
      throw new ChatCommandError("unsupported_command");
  }
}
export function requireRoomRole(role: number | undefined, minimum: number) {
  if (role === undefined || role < minimum) throw new ChatCommandError("room_permission_denied");
}
