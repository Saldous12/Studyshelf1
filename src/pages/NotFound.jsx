import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center animate-fade-up">
      <p className="text-6xl font-black tracking-tight text-[var(--text-primary)]">404</p>
      <div>
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">Page not found</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          That page doesn't exist, or the activity may have been removed.
        </p>
      </div>
      <Button as={Link} to="/" variant="primary">
        <Compass size={16} />
        Back to Home
      </Button>
    </div>
  );
}
