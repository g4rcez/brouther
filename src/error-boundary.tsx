import React from "react";
import { NotFoundRoute } from "./errors";
import { useRouter } from "./router";
import { ErrorBoundaryProps } from "./types";

class HistoryBoundary extends React.Component<
  React.PropsWithChildren<
    ErrorBoundaryProps & { onTrack: (changed: boolean) => void }
  >,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: error instanceof NotFoundRoute, error };
  }

  componentDidCatch() {
    this.props.onTrack(true);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.state.hasError && this.props.Route404) {
      return <this.props.Route404 state={this.props.state} />;
    }
    throw this.state.error;
  }
}

function usePrevious<T>(value: T) {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export const ErrorBoundary: React.FC<
  React.PropsWithChildren<ErrorBoundaryProps>
> = ({ children, state, Route404 }) => {
  const [id, setId] = React.useState(0);
  const [track, setOnTrack] = React.useState(false);

  const { path } = useRouter();
  const previousPathname = usePrevious(path);

  React.useEffect(() => {
    if (track && previousPathname !== path) {
      setId((key) => key + 1);
      setOnTrack(false);
    }
  }, [track, previousPathname, path]);

  return (
    <HistoryBoundary
      key={id}
      state={state}
      Route404={Route404}
      onTrack={setOnTrack}
      children={children}
    />
  );
};
