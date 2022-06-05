import { SetStateAction, useCallback } from "react";
import { createUrlWithNewQueryString, parseQueryString } from "./lib";
import { useNavigator, useRouter } from "./router";
import { InferQueryString, QueryString } from "./types";

export const useQueryString = <Path extends string>(
  _?: InferQueryString<Path>
): [
  queryString: InferQueryString<Path>,
  setQueryString: React.Dispatch<SetStateAction<InferQueryString<Path>>>
] => {
  const goTo = useNavigator();
  const { queryString } = useRouter();

  const onSetQueryString: React.Dispatch<
    SetStateAction<InferQueryString<Path>>
  > = useCallback(
    (args): void => {
      const newQs =
        typeof args === "function" ? args(parseQueryString()) : args;
      const newPath = createUrlWithNewQueryString(newQs);
      goTo(newPath);
    },
    [goTo]
  );

  return [queryString as InferQueryString<Path>, onSetQueryString];
};
