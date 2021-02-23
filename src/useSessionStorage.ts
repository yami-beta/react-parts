import { useState, useCallback } from "react";

export const useSessionStorage = <T>(key: string, initialValue: T) => {
  const [state, setState] = useState(() => {
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

  const setStateAndStorage = useCallback(
    (valueOrFunc: Parameters<typeof setState>[0]) => {
      setState(valueOrFunc);
      try {
        const value =
          valueOrFunc instanceof Function ? valueOrFunc(state) : valueOrFunc;
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch {
        // catch error and do nothing because useState works even if sessionStorage is restricted
      }
    },
    [key, state]
  );

  return [state, setStateAndStorage] as const;
};
