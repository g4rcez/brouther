import { SetStateAction, useCallback } from "react";
import { createUrlWithNewQueryString, parseQueryString } from "./lib";
import { useNavigator, useRouter } from "./router";
import { QueryString } from "./types";

export const useQueryString = <T extends QueryString>(): [
  queryString: T,
  setQueryString: React.Dispatch<SetStateAction<T>>
] => {
  const goTo = useNavigator();
  const { queryString } = useRouter();

  const onSetQueryString: React.Dispatch<SetStateAction<T>> = useCallback(
    (args): void => {
      const newQs =
        typeof args === "function" ? args(parseQueryString()) : args;
      const newPath = createUrlWithNewQueryString(newQs);
      goTo(newPath);
    },
    [goTo]
  );

  return [queryString as T, onSetQueryString];
};
