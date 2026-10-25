import type { CharacterReservation } from "@opencok/contracts/provisioning";
import { reservationSchema } from "@opencok/validations/provisioning";

export function reservationJson(input: CharacterReservation): string {
  const value = reservationSchema.parse(input);
  return JSON.stringify(value);
}
