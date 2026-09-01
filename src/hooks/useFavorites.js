import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { useToast } from "../context/ToastContext.jsx";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const { showToast } = useToast();

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback(
    (id, title) => {
      setFavorites((prev) => {
        const has = prev.includes(id);
        const next = has ? prev.filter((f) => f !== id) : [...prev, id];
        showToast(
          has
            ? `Removed ${title ? `"${title}"` : "activity"} from favorites`
            : `Added ${title ? `"${title}"` : "activity"} to favorites`,
          has ? "default" : "success"
        );
        return next;
      });
    },
    [setFavorites, showToast]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return { favorites, isFavorite, toggleFavorite, clearFavorites };
}
