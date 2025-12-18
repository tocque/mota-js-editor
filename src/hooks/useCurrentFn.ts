import { useRefFrom } from "./useRefFrom";

export const useCurrentFn = <A extends unknown[], R>(fn: (...args: A) => R) => {
  const fnRef = useRefFrom(fn);
  return (...args: A) => fnRef.current(...args);
}
