import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getSesion, getCitas, guardarDiagnostico, getUsuarios, type Cita } from "@/lib/data";
import { Header } from "@/components/Header";
import { CitaCard } from "@/components/CitaCard";
import { Stethoscope, X, Save } from "lucide-react";

export const Route = createFileRoute("/dashboard-doctor")({
  head: () => ({
    meta: [
      { title: "Dashboard Doctor - SaludDigital" },
      { name: "description", content: "Panel de control del médico." },
    ],
  }),
  component: DashboardDoctor,
});

function DashboardDoctor() {
  const navigate = useNavigate();
  const [sesion] = useState(getSesion());
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [diagnostico, setDiagnostico] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [imagen, setImagen] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const s = getSesion();
    if (!s || s.rol !== "doctor") {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  if (!sesion) return null;

  const citas = getCitas().filter((c) => c.doctorId === sesion.id);
  const pendientes = citas.filter((c) => c.estado === "Pendiente");
  const finalizadas = citas.filter((c) => c.estado === "Finalizada");

  const handleDiagnosticar = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setDiagnostico("");
    setObservaciones("");
    setImagen("");
  };

  const handleGuardar = () => {
    if (!citaSeleccionada || !diagnostico.trim()) return;
    guardarDiagnostico(citaSeleccionada.id, diagnostico, observaciones, imagen);
    setCitaSeleccionada(null);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="min-h-screen" key={refresh}>
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard Médico</h1>
          <p className="text-sm text-muted-foreground">
            {sesion.nombre} — {sesion.especialidad_principal}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="health-card border border-border p-5 text-center">
            <p className="text-3xl font-bold text-primary">{pendientes.length}</p>
            <p className="text-sm text-muted-foreground">Citas pendientes</p>
          </div>
          <div className="health-card border border-border p-5 text-center">
            <p className="text-3xl font-bold text-success">{finalizadas.length}</p>
            <p className="text-sm text-muted-foreground">Consultas finalizadas</p>
          </div>
        </div>

        {/* Diagnosis modal */}
        {citaSeleccionada && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Registrar Diagnóstico
                </h2>
                <button onClick={() => setCitaSeleccionada(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Paciente: {getUsuarios().find((u) => u.id === citaSeleccionada.pacienteId)?.nombre} — {citaSeleccionada.motivo}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Diagnóstico *</label>
                  <textarea
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Escriba el diagnóstico..."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Observaciones</label>
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Observaciones adicionales..."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">URL de imagen médica</label>
                  <input
                    type="url"
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="https://ejemplo.com/radiografia.jpg"
                  />
                </div>
                <button
                  onClick={handleGuardar}
                  disabled={!diagnostico.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Guardar diagnóstico
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending appointments */}
        <h2 className="mb-4 text-lg font-bold text-foreground">Citas del día</h2>
        <div className="mb-8 space-y-4">
          {pendientes.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <Stethoscope className="mx-auto mb-3 h-10 w-10" />
              <p>No tienes citas pendientes</p>
            </div>
          )}
          {pendientes.map((c) => (
            <CitaCard key={c.id} cita={c} viewAs="doctor" onDiagnosticar={handleDiagnosticar} />
          ))}
        </div>

        {/* Completed */}
        {finalizadas.length > 0 && (
          <>
            <h2 className="mb-4 text-lg font-bold text-foreground">Consultas finalizadas</h2>
            <div className="space-y-4">
              {finalizadas.map((c) => (
                <CitaCard key={c.id} cita={c} viewAs="doctor" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
