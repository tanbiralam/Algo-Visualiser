import { useState } from "react";
import { BsCheck2, BsLink45Deg } from "react-icons/bs";
import { buildQuery } from "@/lib/share";
import { Button } from "./VisualiserShell";

/** Puts the current state in the address bar and copies the link. */
export function ShareButton({ getParams }: { getParams: () => Record<string, string | number | undefined> }) {
  const [message, setMessage] = useState<string | null>(null);

  const share = async () => {
    const url = `${location.origin}${location.pathname}?${buildQuery(getParams())}`;
    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied");
    } catch {
      setMessage("Link in address bar"); // clipboard can be blocked; the URL is still updated
    }
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <Button onClick={share}>
      {message ? <BsCheck2 /> : <BsLink45Deg />} {message ?? "Share"}
    </Button>
  );
}
