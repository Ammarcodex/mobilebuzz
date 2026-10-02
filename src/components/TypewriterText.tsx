"use client";

import { useEffect, useState } from "react";

/** Types `text` out one character at a time on mount, like it's being
 * written live. Renders the full text immediately on the server (and for
 * reduced-motion users) so there's no flash of missing content and nothing
 * is ever hidden from non-JS clients — the animation is a client-side
 * enhancement layered on top. */
export default function TypewriterText({
  text,
  speed = 35,
}: {
  text: string;
  speed?: number;
}) {
  const [shown, setShown] = useState(text);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: resets to empty on mount to run the one-time typing animation, not deriving render state
    setShown("");
    setTyping(true);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setTyping(false);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <>
      {shown}
      {typing ? (
        <span className="typewriter-cursor" aria-hidden="true" />
      ) : null}
    </>
  );
}
