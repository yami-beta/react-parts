import { act, renderHook } from "@testing-library/react-hooks";
import { useAsyncFn } from "./useAsyncFn";

describe(useAsyncFn.name, () => {
  test("it should return initialState", () => {
    const { result } = renderHook(() => useAsyncFn(() => Promise.resolve()));

    expect(result.current[0]).toEqual({
      loading: false,
    });
  });

  test("it should set return value of async function", async () => {
    const fn = jest.fn().mockResolvedValue("success");
    const { result } = renderHook(() =>
      useAsyncFn(fn, { loading: false, value: "" })
    );

    expect(result.current[0]).toEqual({
      loading: false,
      value: "",
    });

    await act(async () => {
      await result.current[1]();
    });

    expect(result.current[0]).toEqual({
      loading: false,
      value: "success",
    });

    expect(fn.mock.calls.length).toBe(1);
  });

  test("it should not set value if async function return promise rejected", async () => {
    const fn = jest.fn().mockRejectedValue("fail");
    const { result } = renderHook(() =>
      useAsyncFn(fn, { loading: false, value: "" })
    );

    await act(async () => {
      await expect(result.current[1]()).rejects.toBe("fail");
    });

    expect(result.current[0]).toEqual({
      loading: false,
    });

    expect(fn.mock.calls.length).toBe(1);
  });

  test("it should set state by last called async function", async () => {
    const promiseList: { resolve: () => void }[] = [];
    const fn = jest
      .fn()
      .mockImplementationOnce(() => {
        return new Promise((resolve) => {
          promiseList.push({ resolve: () => resolve("foo") });
        });
      })
      .mockImplementation(() => {
        return new Promise((resolve) => {
          promiseList.push({ resolve: () => resolve("bar") });
        });
      });

    const { result } = renderHook(() => useAsyncFn(fn));

    let call1: Promise<any>;
    act(() => {
      call1 = result.current[1]();
    });

    expect(result.current[0]).toEqual({ loading: true });
    expect(fn.mock.calls.length).toBe(1);

    let call2: Promise<any>;
    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toEqual({ loading: true });
    expect(fn.mock.calls.length).toBe(2);

    await act(async () => {
      promiseList[1].resolve();
      await call2;
    });

    expect(result.current[0]).toEqual({ loading: false, value: "bar" });

    await act(async () => {
      promiseList[0].resolve();
      await call1;
    });

    expect(result.current[0]).toEqual({ loading: false, value: "bar" });
  });
});
