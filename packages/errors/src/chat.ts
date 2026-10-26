export class ChatCommandError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}
