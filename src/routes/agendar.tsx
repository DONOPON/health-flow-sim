import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { getSesion, getDoctores, ESPECIALIDADES, agendarCita, getCitas } from "@/lib/data";

import { Calendar, Search, CheckCircle2, Clock, Ban } from "lucide-react";

// Genera slots de 08:00 a 18:00 cada 30 minutos
const SLOTS_HORA: string[] = (() => {
  const slots: string[] = [];
  for (let h = 8; h < 18; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
})();

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

  // Calcula horarios ocupados del médico en la fecha seleccionada
  const horariosOcupados = useMemo(() => {
    if (!doctorId || !fecha) return new Set<string>();
    const citas = getCitas();
    return new Set(
      citas
        .filter(
          (c) =>
            c.doctorId === Number(doctorId) &&
            c.fecha === fecha &&
            c.estado !== "Cancelada",
        )
        .map((c) => c.hora),
    );
  }, [doctorId, fecha]);

  // Resetea hora si la fecha o el doctor cambian
  useEffect(() => {
    setHora("");
  }, [doctorId, fecha]);

  if (!sesion) return null;

  const doctores = getDoctores();
  const doctoresFiltrados = especialidad
    ? doctores.filter((d) => d.especialidad_principal === especialidad)
    : doctores;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !fecha || !hora || !motivo) return;
    if (horariosOcupados.has(hora)) return;
    agendarCita(sesion.id, Number(doctorId), fecha, hora, motivo);
    setExito(true);
    setTimeout(() => navigate({ to: "/dashboard-paciente" }), 2000);
  };

  if (exito) {
    return (
      <div className="min-h-screen">
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
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Fecha *</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required min={new Date().toISOString().split("T")[0]} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">Hora *</label>
                {doctorId && fecha && (
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />Disponible</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" />Ocupado</span>
                  </div>
                )}
              </div>

              {!doctorId || !fecha ? (
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-4 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Selecciona médico y fecha para ver horarios disponibles
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {SLOTS_HORA.map((slot) => {
                      const ocupado = horariosOcupados.has(slot);
                      const seleccionado = hora === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={ocupado}
                          onClick={() => setHora(slot)}
                          title={ocupado ? "Horario no disponible" : `Disponible: ${slot}`}
                          className={
                            seleccionado
                              ? "rounded-lg border-2 border-primary bg-primary px-2 py-2 text-xs font-semibold text-primary-foreground shadow-sm"
                              : ocupado
                                ? "flex cursor-not-allowed items-center justify-center gap-1 rounded-lg border border-border bg-muted/50 px-2 py-2 text-xs text-muted-foreground line-through opacity-60"
                                : "rounded-lg border border-success/40 bg-success/10 px-2 py-2 text-xs font-medium text-success transition-colors hover:border-success hover:bg-success/20"
                          }
                        >
                          {ocupado ? (
                            <><Ban className="inline h-3 w-3" />{slot}</>
                          ) : (
                            slot
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {hora && horariosOcupados.has(hora) && (
                    <p className="mt-2 text-xs text-destructive">Horario no disponible, elige otro.</p>
                  )}
                  {!hora && (
                    <p className="mt-2 text-xs text-muted-foreground">Toca un horario en verde para seleccionarlo.</p>
                  )}
                </>
              )}
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
