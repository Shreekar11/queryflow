import { RateLimiterResult } from "../types";
import { useState, useEffect, useCallback } from "react";

const RATE_LIMIT = 10;
const TIME_WINDOW = 60 * 1000;

export const useRateLimiter = (): RateLimiterResult => {
  const [requestTimestamps, setRequestTimestamps] = useState<number[]>([]);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  const getRecentRequests = useCallback((): number[] => {
    const currentTime = Date.now();

    return requestTimestamps.filter(
      (timestamp) => currentTime - timestamp < TIME_WINDOW
    );
  }, [requestTimestamps]);

  const canMakeRequest = useCallback((): boolean => {
    const recentRequests = getRecentRequests();

    if (recentRequests.length !== requestTimestamps.length) {
      setRequestTimestamps(recentRequests);
    }

    return recentRequests.length < RATE_LIMIT;
  }, [getRecentRequests, requestTimestamps]);

  const addRequestTimestamp = useCallback((): void => {
    const currentTime = Date.now();
    const recentRequests = getRecentRequests();

    setRequestTimestamps([...recentRequests, currentTime]);
  }, [getRecentRequests]);

  const getTimeUntilReset = useCallback((): number => {
    const recentRequests = getRecentRequests();
    if (recentRequests.length === 0) return 0;

    const oldestTimestamp = recentRequests[0];
    const currentTime = Date.now();
    const time = currentTime - oldestTimestamp;

    return Math.max(0, Math.ceil((TIME_WINDOW - time) / 1000));
  }, [getRecentRequests]);

  useEffect(() => {
    const interval = setInterval(() => {
      const recentRequests = getRecentRequests();

      if (recentRequests.length !== requestTimestamps.length) {
        setRequestTimestamps(recentRequests);
      }

      if (recentRequests.length >= RATE_LIMIT) {
        const timeUntilReset = getTimeUntilReset();
        setRateLimitMessage(
          `Rate limit reached (${RATE_LIMIT} requests per minute). Please wait ${timeUntilReset} seconds to try again.`
        );
      } else {
        setRateLimitMessage(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [getRecentRequests, getTimeUntilReset, requestTimestamps]);

  return {
    canMakeRequest,
    addRequestTimestamp,
    rateLimitMessage,
  };
};
