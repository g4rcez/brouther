import type { Story } from "./story";

export type Routes = {
  path: string;
  Component: React.FC<React.PropsWithChildren<any>>;
};

export type ErrorBoundaryProps = Boundaries & {
  state: InternalState;
};

export type Boundaries = {
  Route404?: React.FC<React.PropsWithChildren<{ state: InternalState }>>;
};

type RenderProps = {
  hash: string;
  path: string;
  state: object;
  params: object;
  search: object;
};

export type StoryProps = ReturnType<typeof Story>;

export type InternalState = RenderProps & {
  boundaries: Boundaries;
} & StoryProps & {
    Render: React.FC<React.PropsWithChildren<RenderProps>>;
    state: object;
  };
