import React from "react";
import { usePrevious } from "./lib";
import { useRouter } from "./router";
import { BoundaryHistoryProps } from "./types";

type State = { panic: boolean; error: Error | null };

class HistoryBoundary extends React.Component<
  React.PropsWithChildren<
    BoundaryHistoryProps & { onPanic: (panic: boolean) => void }
  >,
  State
> {
  constructor(props: any) {
    super(props);
    this.state = { panic: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { panic: !!error, error };
  }

  componentDidCatch() {
    this.props.onPanic(true);
  }

  render() {
    if (!this.state.panic) return this.props.children;
    if (this.state.panic && this.props.Route404) {
      return <this.props.Route404 state={this.props.state} />;
    }
    throw this.state.error;
  }
}

const increment = (n: number) => n + 1;

export const ErrorBoundary: React.FC<
  React.PropsWithChildren<BoundaryHistoryProps>
> = ({ children, state, Route404 }) => {
  const [id, setId] = React.useState<number>(0);
  const [panic, setPanic] = React.useState<boolean>(false);
  const { path } = useRouter();
  const previousPathname = usePrevious(path);

  React.useEffect(() => {
    if (panic && previousPathname !== path) {
      setId(increment);
      setPanic(false);
    }
  }, [panic, previousPathname, path]);

  return (
    <HistoryBoundary
      key={id}
      state={state}
      onPanic={setPanic}
      Route404={Route404}
    >
      {children}
    </HistoryBoundary>
  );
};
