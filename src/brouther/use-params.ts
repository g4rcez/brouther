import { useContext } from "react";
import { HistoryContext } from "./router";

export const useParams = <T>(): T => {
  const ctx = useContext(HistoryContext);
  return ctx.params as never;
};
