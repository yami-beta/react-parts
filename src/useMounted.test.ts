import { renderHook } from "@testing-library/react-hooks";
import { useMounted } from "./useMounted";

describe(useMounted.name, () => {
  test("mounted", () => {
    const { result } = renderHook(() => useMounted());

    expect(result.current()).toBe(true);
  });

  test("unmounted", () => {
    const { result, unmount } = renderHook(() => useMounted());

    unmount();

    expect(result.current()).toBe(false);
  });
});
