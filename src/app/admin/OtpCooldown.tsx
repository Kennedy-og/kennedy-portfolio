"use client";

import { useEffect, useState } from "react";

type OtpCooldownProps = {
  secondsRemaining: number;
};

export function OtpCooldown({ secondsRemaining }: OtpCooldownProps) {
  const [remaining, setRemaining] = useState(secondsRemaining);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(secondsRemaining);
  }, [secondsRemaining]);

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remaining]);

  if (remaining <= 0) {
    return null;
  }

  return (
    <p className="text-xs text-neutral-300">You can request a new code in {remaining}s.</p>
  );
}
