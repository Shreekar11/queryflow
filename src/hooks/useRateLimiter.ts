import { useState, useEffect } from "react";

const RATE_LIMIT = 5;
const TIME_WINDOW = 60 * 1000;

interface RateLimiterResult {
  canMakeRequest: () => boolean;
  addRequestTimestamp: () => void;
  rateLimitMessage: string | null;
}

export const useRateLimiter = (): RateLimiterResult => {
  const [requestTimestamps, setRequestTimestamps] = useState<number[]>([]);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  const canMakeRequest = (): boolean => {
    const currentTime = Date.now();
    const recentRequests = requestTimestamps.filter(
      (timestamp) => currentTime - timestamp < TIME_WINDOW
    );

    return recentRequests.length < RATE_LIMIT;
  };

  const addRequestTimestamp = (): void => {
    const currentTime = Date.now();

    setRequestTimestamps((prev) =>
      [...prev, currentTime].filter(
        (timestamp) => currentTime - timestamp < TIME_WINDOW
      )
    );
  };

  const getTimeUntilReset = (): number => {
    if (requestTimestamps.length === 0) return 0;

    const oldestTimestamp = requestTimestamps[0];
    const currentTime = Date.now();
    const timeElapsed = currentTime - oldestTimestamp;

    return Math.max(0, Math.ceil((TIME_WINDOW - timeElapsed) / 1000));
  };

  useEffect(() => {
    const currentTime = Date.now();

    setRequestTimestamps((prev) =>
      prev.filter((timestamp) => currentTime - timestamp < TIME_WINDOW)
    );

    if (!canMakeRequest()) {
      const timeUntilReset = getTimeUntilReset();
      setRateLimitMessage(
        `Rate limit reached (${RATE_LIMIT} requests per minute). Please wait ${timeUntilReset} seconds to try again.`
      );
    } else {
      setRateLimitMessage(null);
    }

    const interval = setInterval(() => {
      if (!canMakeRequest()) {
        const timeUntilReset = getTimeUntilReset();

        setRateLimitMessage(
          `Rate limit reached (${RATE_LIMIT} requests per minute). Please wait ${timeUntilReset} seconds to try again.`
        );
      } else {
        setRateLimitMessage(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [requestTimestamps]);

  return {
    canMakeRequest,
    addRequestTimestamp,
    rateLimitMessage,
  };
};
