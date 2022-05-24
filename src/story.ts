export const Story = () => {
  const history = window.history;
  const go = (path: string, state?: object): void =>
    void history.pushState(state, "", path);
  const replace = (path: string, state?: object): void =>
    void history.replaceState(state, "", path);
  const back = (): void => void history.back();
  const forward = (): void => void history.forward();
  return { go, back, forward, history, replace };
};
