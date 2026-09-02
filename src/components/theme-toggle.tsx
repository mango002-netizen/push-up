import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    setReady(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("logorank-theme", next);
    } catch {
      /* ignore */
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
    >
      <span className="relative flex size-4 items-center justify-center">
        <Sun
          className={`absolute size-4 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
            ready && theme === "light"
              ? "scale-100 opacity-100 blur-none"
              : "scale-[0.25] opacity-0 blur-[4px]"
          }`}
        />
        <Moon
          className={`absolute size-4 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
            ready && theme === "dark"
              ? "scale-100 opacity-100 blur-none"
              : "scale-[0.25] opacity-0 blur-[4px]"
          }`}
        />
      </span>
    </Button>
  );
}
