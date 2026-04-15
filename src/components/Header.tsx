import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Heart, User, Stethoscope } from "lucide-react";
import { getSesion, logout } from "@/lib/data";

export function Header() {
  const navigate = useNavigate();
  const sesion = getSesion();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg health-gradient">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">SaludDigital</span>
        </Link>

        {sesion && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {sesion.rol === "doctor" ? (
                <Stethoscope className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span>{sesion.nombre}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                {sesion.rol}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
