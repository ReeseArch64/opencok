export type Schedule = (run: () => void, delay: number) => () => void;
