import { ActionState } from "../context";
import { useBrouther } from "./use-brouther";

export const useFormActions = <R extends object>(): ActionState<R> => useBrouther().actions;
