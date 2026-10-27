import { javaDecimal } from "@opencok/rules/java-integer";

export const integer = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));

export const long = (value: unknown) => {
  if (typeof value === "number" && !Number.isSafeInteger(value))
    {throw new Error("Invalid march time");}

  return javaDecimal(String(value ?? 0), 64);
};

export const string = (value: unknown) => {
  if (typeof value !== "string") {throw new Error("Invalid march identity");}

  return value;
};
