import { useCallback, useEffect, useRef } from "react";

export const useMounted = () => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const fn = useCallback(() => mounted.current, []);

  return fn;
};
