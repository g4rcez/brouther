import { useEffect } from "react";
import { Link } from "./brouther/router";
import { useParams } from "./brouther/use-params";
export default function Root(props: { title: string }) {
  const params = useParams();
  useEffect(() => {
    console.log(params);
  }, [params]);
  return (
    <h1>
      <Link href="/">{props.title}</Link>
    </h1>
  );
}
