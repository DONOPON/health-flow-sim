import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Heart, User, Stethoscope } from "lucide-react";
import { getSesion, logout } from "@/lib/data";
import { useState, useEffect } from "react";

export function Header() {
  const navigate = useNavigate();
  const sesion = getSesion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  // When logged in, always show solid bg. When on landing (no session), dynamic.
  const isTransparent = !sesion && !scrolled;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "border-b border-border bg-primary shadow-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isTransparent ? "bg-white/20" : "bg-white/20"}`}>
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">SaludDigital</span>
        </Link>

        {sesion ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-white/80">
              {sesion.rol === "doctor" ? (
                <Stethoscope className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span>{sesion.nombre}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white capitalize">
                {sesion.rol}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-primary transition-all hover:scale-105"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
