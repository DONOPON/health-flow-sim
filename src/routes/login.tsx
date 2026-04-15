import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "@/lib/data";
import { Heart, LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar Sesión - SaludDigital" },
      { name: "description", content: "Inicia sesión en tu portal de salud digital." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const u = login(email, password);
    if (!u) {
      setError("Credenciales incorrectas");
      return;
    }
    navigate({ to: u.rol === "paciente" ? "/dashboard-paciente" : "/dashboard-doctor" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl health-gradient">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Iniciar Sesión</h1>
          <p className="mt-1 text-sm text-muted-foreground">Accede a tu portal de salud</p>
        </div>

        <form onSubmit={handleSubmit} className="health-card border border-border p-6">
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="tu@email.com"
            />
          </div>
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <LogIn className="h-4 w-4" />
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-medium text-primary hover:underline">
            Regístrate
          </Link>
        </p>

        <div className="mt-6 rounded-lg bg-muted p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Cuentas demo:</p>
          <p className="mt-1">Paciente: pedro@email.com / 1234</p>
          <p>Doctor: maria@salud.com / 1234</p>
        </div>
      </div>
    </div>
  );
}
