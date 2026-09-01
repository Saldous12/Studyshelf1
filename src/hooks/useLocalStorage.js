import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON, subscribe } from "../utils/storage.js";

/**
 * React state that is persisted to localStorage (under the "studyshelf:"
 * namespace) and stays in sync across every component that uses the same
 * key, in the same tab, instantly.
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => readJSON(key, defaultValue));

  useEffect(() => {
    return subscribe(key, (next) => {
      setValue(next === undefined ? defaultValue : next);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        writeJSON(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, update];
}
