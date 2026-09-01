import { useId, useState } from "react";

export default function Tooltip({ label, children, side = "bottom" }) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  const sideClasses = {
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {typeof children === "function"
        ? children({ "aria-describedby": id })
        : children}
      <span
        role="tooltip"
        id={id}
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg card-surface px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] shadow-elevated transition-all duration-150 ${sideClasses[side]} ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {label}
      </span>
    </span>
  );
}
