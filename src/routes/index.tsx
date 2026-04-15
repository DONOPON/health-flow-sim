import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, Stethoscope, UserCheck, Shield, ArrowRight } from "lucide-react";
import { getSesion } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SaludDigital - Portal de Salud Digital" },
      { name: "description", content: "Tu portal de salud digital. Agenda citas, consulta tu historial clínico y descarga tus diagnósticos." },
      { property: "og:title", content: "SaludDigital - Portal de Salud Digital" },
      { property: "og:description", content: "Tu portal de salud digital. Agenda citas, consulta tu historial clínico y descarga tus diagnósticos." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const sesion = getSesion();

  if (sesion) {
    if (sesion.rol === "paciente") navigate({ to: "/dashboard-paciente" });
    else navigate({ to: "/dashboard-doctor" });
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="health-gradient px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-2 text-sm text-primary-foreground">
            <Heart className="h-4 w-4" />
            Portal de Salud Digital
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Tu salud, centralizada y accesible
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Agenda citas, consulta tu historial clínico y descarga tus diagnósticos. Todo en un solo lugar.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/registro"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground">
          ¿Qué puedes hacer?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Stethoscope, title: "Agenda citas", desc: "Busca médicos por especialidad y agenda tu cita en segundos." },
            { icon: Shield, title: "Historial clínico", desc: "Tu historial médico completo, seguro y siempre disponible." },
            { icon: UserCheck, title: "Médicos favoritos", desc: "Guarda a tu médico de confianza para agendar más rápido." },
          ].map((f, i) => (
            <div key={i} className="health-card border border-border p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        <p>SaludDigital — Prototipo funcional de Portal de Salud Digital</p>
      </footer>
    </div>
  );
}
