import type { Row } from "./rows";
export interface ExpeditionCalendarState {
  latest?: Row;
  legacy: readonly Row[];
}
export interface ExpeditionCalendarPlan {
  current?: Row;
  create?: Row;
  close?: string;
}
export interface ExpeditionCalendarStore {
  reconcile(
    build: (state: ExpeditionCalendarState) => ExpeditionCalendarPlan,
  ): Promise<Row | undefined>;
}
