import { RateLimiterResult } from "../types";
import { useState, useEffect, useCallback } from "react";

const RATE_LIMIT = 10;
const TIME_WINDOW = 60 * 1000;

export const useRateLimiter = (): RateLimiterResult => {
  const [requestTimestamps, setRequestTimestamps] = useState<number[]>([]);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  /**
   * @description Retrieves the list of recent request timestamps within the defined time window.
   *
   * @remarks
   * - Filters `requestTimestamps` to include only timestamps within the `TIME_WINDOW`.
   * - Wrapped in `useCallback` to prevent unnecessary function re-renders.
   *
   * @returns {number[]} An array of timestamps (in milliseconds) that are within the time window.
   */
  const getRecentRequests = useCallback((): number[] => {
    const currentTime = Date.now();

    return requestTimestamps.filter(
      (timestamp) => currentTime - timestamp < TIME_WINDOW
    );
  }, [requestTimestamps]);

  /**
   * @description Determines whether a new request can be made based on the rate limit.
   * Updates the `requestTimestamps` state if old timestamps are filtered out.
   *
   * @remarks
   * - Uses `getRecentRequests` to get the current list of recent timestamps.
   * - Updates `requestTimestamps` state if any timestamps are outside the time window.
   * - Compares the number of recent requests against the `RATE_LIMIT`.
   * - Wrapped in `useCallback` to prevent unnecessary function re-renders.
   *
   * @returns {boolean} `true` if a new request can be made, `false` if the rate limit is exceeded.
   */
  const canMakeRequest = useCallback((): boolean => {
    const recentRequests = getRecentRequests();

    if (recentRequests.length !== requestTimestamps.length) {
      setRequestTimestamps(recentRequests);
    }

    return recentRequests.length < RATE_LIMIT;
  }, [getRecentRequests, requestTimestamps]);

  /**
   * @description Adds a new request timestamp to the `requestTimestamps` state.
   * Ensures only recent timestamps within the time window are present.
   *
   * @remarks
   * - Uses `getRecentRequests` to filter out old timestamps.
   * - Adds the current timestamp to the list of recent timestamps.
   * - Wrapped in `useCallback` to prevent unnecessary function re-renders.
   *
   * @returns {void}
   */
  const addRequestTimestamp = useCallback((): void => {
    const currentTime = Date.now();
    const recentRequests = getRecentRequests();

    setRequestTimestamps([...recentRequests, currentTime]);
  }, [getRecentRequests]);

  /**
   * @description Calculates the time (in seconds) until the rate limit resets.
   * Returns 0 if there are no recent requests.
   *
   * @remarks
   * - Uses `getRecentRequests` to get the list of recent timestamps.
   * - Calculates the time elapsed since the oldest timestamp and determines
   *   the remaining time until the `TIME_WINDOW` expires.
   * - Wrapped in `useCallback` to prevent unnecessary function re-renders.
   *
   * @returns {number} The number of seconds until the rate limit resets, or 0 if no requests exist.
   */
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
