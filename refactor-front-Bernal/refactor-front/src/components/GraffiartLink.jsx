import { Link } from "react-router";

export default function GraffiartLink({
  className = "text-base font-bold text-white",
}) {
  return (
    <Link to="/" className={className}>
      GraffiArt
    </Link>
  );
}