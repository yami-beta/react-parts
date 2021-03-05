import { useCallback, useRef, useState } from "react";
import { useMounted } from "./useMounted";

type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

type AsyncFn = (...args: any[]) => Promise<any>;

type UseAsyncFnState<T extends AsyncFn> = {
  loading: boolean;
  value?: PromiseType<ReturnType<T>>;
};

export const useAsyncFn = <T extends AsyncFn>(
  asyncFn: T,
  initialState: UseAsyncFnState<T> = { loading: false }
) => {
  const lastCallId = useRef(0);
  const isMounted = useMounted();

  const [state, setState] = useState(initialState);

  const fn = useCallback(
    (...args: Parameters<T>) => {
      const callId = ++lastCallId.current;
      setState((prev) => ({ ...prev, loading: true }));

      return asyncFn(...args)
        .then((value) => {
          isMounted() &&
            callId === lastCallId.current &&
            setState({ loading: false, value });
        })
        .catch((error) => {
          isMounted() &&
            callId === lastCallId.current &&
            setState({ loading: false });
          return Promise.reject(error);
        });
    },
    [asyncFn, isMounted]
  );

  return [state, fn] as const;
};
