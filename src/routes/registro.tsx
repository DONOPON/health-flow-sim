import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { registrar, ESPECIALIDADES } from "@/lib/data";
import { Heart, UserPlus } from "lucide-react";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Registro - SaludDigital" },
      { name: "description", content: "Crea tu cuenta en SaludDigital." },
    ],
  }),
  component: RegistroPage,
});

function RegistroPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"paciente" | "doctor">("paciente");
  const [especialidad, setEspecialidad] = useState<string>(ESPECIALIDADES[0]);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const u = registrar({
      nombre,
      email,
      password,
      rol,
      especialidad_principal: rol === "doctor" ? especialidad : undefined,
    });
    if (!u) {
      setError("El correo ya está registrado");
      return;
    }
    navigate({ to: rol === "paciente" ? "/dashboard-paciente" : "/dashboard-doctor" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl health-gradient">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Crear Cuenta</h1>
          <p className="mt-1 text-sm text-muted-foreground">Únete a SaludDigital</p>
        </div>

        <form onSubmit={handleSubmit} className="health-card border border-border p-6">
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Nombre completo</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Rol</label>
            <div className="flex gap-3">
              {(["paciente", "doctor"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRol(r)}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
                    rol === r ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {rol === "doctor" && (
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Especialidad</label>
              <select
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {ESPECIALIDADES.map((esp) => (
                  <option key={esp} value={esp}>{esp}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
