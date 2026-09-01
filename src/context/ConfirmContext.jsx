import { createContext, useCallback, useContext, useRef, useState } from "react";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolver.current = resolve;
      setDialog({
        title: options?.title || "Are you sure?",
        description: options?.description || "This action cannot be undone.",
        confirmLabel: options?.confirmLabel || "Confirm",
        cancelLabel: options?.cancelLabel || "Cancel",
        destructive: options?.destructive ?? true,
      });
    });
  }, []);

  function handleClose(result) {
    setDialog(null);
    if (resolver.current) {
      resolver.current(result);
      resolver.current = null;
    }
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <ConfirmDialog
          {...dialog}
          onConfirm={() => handleClose(true)}
          onCancel={() => handleClose(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return ctx.confirm;
}
