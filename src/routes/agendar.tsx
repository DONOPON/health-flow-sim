import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getSesion, getDoctores, ESPECIALIDADES, agendarCita } from "@/lib/data";
import { Header } from "@/components/Header";
import { Calendar, Search, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Agendar Cita - SaludDigital" },
      { name: "description", content: "Agenda tu cita médica." },
    ],
  }),
  component: AgendarPage,
  validateSearch: (search: Record<string, unknown>) => ({
    doctorId: search.doctorId ? Number(search.doctorId) : undefined,
  }),
});

function AgendarPage() {
  const navigate = useNavigate();
  const { doctorId: preselectedDoctor } = Route.useSearch();
  const [sesion] = useState(getSesion());
  const [especialidad, setEspecialidad] = useState("");
  const [doctorId, setDoctorId] = useState<number | "">(preselectedDoctor || "");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const s = getSesion();
    if (!s || s.rol !== "paciente") navigate({ to: "/login" });
  }, [navigate]);

  if (!sesion) return null;

  const doctores = getDoctores();
  const doctoresFiltrados = especialidad
    ? doctores.filter((d) => d.especialidad_principal === especialidad)
    : doctores;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !fecha || !hora || !motivo) return;
    agendarCita(sesion.id, Number(doctorId), fecha, hora, motivo);
    setExito(true);
    setTimeout(() => navigate({ to: "/dashboard-paciente" }), 2000);
  };

  if (exito) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <CheckCircle2 className="mb-4 h-16 w-16 text-success" />
          <h2 className="text-2xl font-bold text-foreground">¡Cita agendada!</h2>
          <p className="mt-2 text-muted-foreground">Redirigiendo a tu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Agendar Cita</h1>
        <p className="mb-8 text-sm text-muted-foreground">Selecciona especialidad, médico, fecha y hora</p>

        <form onSubmit={handleSubmit} className="health-card border border-border p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Especialidad</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  value={especialidad}
                  onChange={(e) => { setEspecialidad(e.target.value); setDoctorId(""); }}
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Todas las especialidades</option>
                  {ESPECIALIDADES.map((esp) => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Médico *</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Seleccionar médico</option>
                {doctoresFiltrados.map((d) => (
                  <option key={d.id} value={d.id}>{d.nombre} — {d.especialidad_principal}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Fecha *</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Hora *</label>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Motivo de consulta *</label>
              <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} required rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Describe brevemente el motivo..." />
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Calendar className="h-4 w-4" />
              Agendar cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
