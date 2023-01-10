import { NotFoundRoute } from "../../src";

export const NotFound = ({ error }: { error: NotFoundRoute | null }) => {
    if (error === null) return null;
    return (
        <div className="error">
            {error.name} - {error.pathname}
        </div>
    );
};
