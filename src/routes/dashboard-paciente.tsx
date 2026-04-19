import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getSesion, getCitas, setFavorito, getDoctores, type Cita } from "@/lib/data";
import { generarPDFReceta } from "@/lib/pdf";

import { FavoriteDoctorCard } from "@/components/FavoriteDoctorCard";
import { CitaCard } from "@/components/CitaCard";
import { Calendar, Pill, Star, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard-paciente")({
  head: () => ({
    meta: [
      { title: "Mi Dashboard - SaludDigital" },
      { name: "description", content: "Panel de control del paciente." },
    ],
  }),
  component: DashboardPaciente,
});

function DashboardPaciente() {
  const navigate = useNavigate();
  const [sesion, setSesionState] = useState(getSesion());
  const [tab, setTab] = useState<"proximas" | "recetas">("proximas");

  useEffect(() => {
    const s = getSesion();
    if (!s || s.rol !== "paciente") {
      navigate({ to: "/login" });
    }
    setSesionState(s);
  }, [navigate]);

  if (!sesion) return null;

  const citas = getCitas().filter((c) => c.pacienteId === sesion.id);
  const citasProximas = citas.filter((c) => c.estado === "Pendiente");
  const recetas = citas.filter((c) => c.estado === "Finalizada");
  const doctores = getDoctores();

  const handleFavorito = (doctorId: number) => {
    const nuevo = sesion?.favorito === doctorId ? undefined : doctorId;
    setFavorito(sesion!.id, nuevo);
    setSesionState(getSesion());
  };

  const handleDescargarReceta = (cita: Cita) => {
    generarPDFReceta(cita);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hola, {sesion.nombre}</h1>
            <p className="text-sm text-muted-foreground">Bienvenido a tu portal de salud</p>
          </div>
          <Link
            to="/agendar"
            search={{ doctorId: undefined }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nueva cita
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { icon: Calendar, label: "Citas pendientes", value: citasProximas.length, color: "text-primary" },
            { icon: Pill, label: "Recetas disponibles", value: recetas.filter((c) => c.receta).length, color: "text-success" },
            { icon: Star, label: "Médico favorito", value: sesion.favorito ? "Sí" : "No", color: "text-accent" },
          ].map((s, i) => (
            <div key={i} className="health-card border border-border p-4 text-center">
              <s.icon className={`mx-auto h-6 w-6 ${s.color}`} />
              <p className="mt-2 text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Favorite doctor */}
        <div className="mb-8">
          <FavoriteDoctorCard paciente={sesion} />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1">
          {([["proximas", "Próximas citas"], ["recetas", "Mis recetas"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {tab === "proximas" && (
            <>
              {citasProximas.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <Calendar className="mx-auto mb-3 h-10 w-10" />
                  <p>No tienes citas pendientes</p>
                  <Link to="/agendar" search={{ doctorId: undefined }} className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                    Agendar una cita
                  </Link>
                </div>
              )}
              {citasProximas.map((c) => (
                <CitaCard key={c.id} cita={c} viewAs="paciente" />
              ))}
            </>
          )}
          {tab === "recetas" && (
            <>
              <p className="mb-2 text-xs text-muted-foreground">
                Por privacidad, solo se muestran las recetas e indicaciones que tu médico te entregó. El historial clínico completo solo es accesible por el doctor.
              </p>
              {recetas.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <Pill className="mx-auto mb-3 h-10 w-10" />
                  <p>Aún no tienes recetas disponibles</p>
                </div>
              )}
              {recetas.map((c) => (
                <CitaCard key={c.id} cita={c} viewAs="paciente" onDescargarReceta={handleDescargarReceta} />
              ))}
            </>
          )}
        </div>

        {/* Doctor list for favorites */}
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-foreground">Médicos disponibles</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {doctores.map((d) => (
              <div key={d.id} className="health-card flex items-center gap-3 border border-border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {d.nombre.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{d.nombre}</p>
                  <p className="text-xs text-muted-foreground">{d.especialidad_principal}</p>
                </div>
                <button
                  onClick={() => handleFavorito(d.id)}
                  className={`rounded-full p-2 transition-colors ${
                    sesion.favorito === d.id ? "bg-accent/20 text-accent" : "text-muted-foreground hover:bg-muted"
                  }`}
                  title="Marcar como favorito"
                >
                  <Star className={`h-4 w-4 ${sesion.favorito === d.id ? "fill-current" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
