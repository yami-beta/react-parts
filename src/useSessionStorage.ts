import { useState, useEffect } from "react";

export const useSessionStorage = <T>(
  key: string,
  initialState: T | (() => T)
) => {
  const [state, setState] = useState(() => {
    const initialValue =
      initialState instanceof Function ? initialState() : initialState;
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      // catch error and do nothing because useState works even if sessionStorage is restricted
    }
  }, [key, state]);

  return [state, setState] as const;
};
