import { act, renderHook } from "@testing-library/react-hooks";
import { useSessionStorage } from "./useSessionStorage";

describe(useSessionStorage.name, () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  test("number", () => {
    const key = "test/number";
    const { result } = renderHook(() => useSessionStorage(key, 0));

    expect(result.current[0]).toBe(0);
    expect(sessionStorage.getItem(key)).toBe(null);

    act(() => {
      result.current[1](2);
    });

    expect(result.current[0]).toBe(2);
    expect(sessionStorage.getItem(key)).toBe("2");

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(3);
    expect(sessionStorage.getItem(key)).toBe("3");
  });

  test("string", () => {
    const key = "test/string";
    const { result } = renderHook(() => useSessionStorage(key, ""));

    expect(result.current[0]).toBe("");
    expect(sessionStorage.getItem(key)).toBe(null);

    act(() => {
      result.current[1]("foo");
    });

    expect(result.current[0]).toBe("foo");
    expect(sessionStorage.getItem(key)).toBe(`"foo"`);

    act(() => {
      result.current[1]((prev) => `${prev}bar`);
    });

    expect(result.current[0]).toBe("foobar");
    expect(sessionStorage.getItem(key)).toBe(`"foobar"`);
  });

  test("boolean", () => {
    const key = "test/boolean";
    const { result } = renderHook(() => useSessionStorage(key, false));

    expect(result.current[0]).toBe(false);
    expect(sessionStorage.getItem(key)).toBe(null);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(sessionStorage.getItem(key)).toBe("true");

    act(() => {
      result.current[1]((prev) => !prev);
    });

    expect(result.current[0]).toBe(false);
    expect(sessionStorage.getItem(key)).toBe("false");
  });

  test("object", () => {
    const key = "test/object";
    const { result } = renderHook(() => useSessionStorage(key, {}));

    expect(result.current[0]).toStrictEqual({});
    expect(sessionStorage.getItem(key)).toBe(null);

    act(() => {
      result.current[1]({ foo: "bar" });
    });

    expect(result.current[0]).toStrictEqual({ foo: "bar" });
    expect(sessionStorage.getItem(key)).toBe(`{"foo":"bar"}`);

    act(() => {
      result.current[1]((prev) => ({ ...prev, one: 1 }));
    });

    expect(result.current[0]).toStrictEqual({ foo: "bar", one: 1 });
    expect(sessionStorage.getItem(key)).toBe(`{"foo":"bar","one":1}`);
  });

  test("it should return initial value if JSON.parse() is failed", () => {
    const key = "test/invalid-value";
    sessionStorage.setItem(key, "{one:1}");

    const { result } = renderHook(() => useSessionStorage(key, {}));

    expect(result.current[0]).toStrictEqual({});
  });
});
