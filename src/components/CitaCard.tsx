import { type Cita, getDoctorById, getUsuarios } from "@/lib/data";
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle, Pill } from "lucide-react";

interface CitaCardProps {
  cita: Cita;
  viewAs: "paciente" | "doctor";
  onDiagnosticar?: (cita: Cita) => void;
  onDescargarReceta?: (cita: Cita) => void;
  onDescargarPDF?: (cita: Cita) => void;
}

export function CitaCard({ cita, viewAs, onDiagnosticar, onDescargarReceta, onDescargarPDF }: CitaCardProps) {
  const doctor = getDoctorById(cita.doctorId);
  const usuarios = getUsuarios();
  const paciente = usuarios.find((u) => u.id === cita.pacienteId);

  const estadoColor = cita.estado === "Finalizada"
    ? "bg-success/10 text-success"
    : cita.estado === "Cancelada"
      ? "bg-destructive/10 text-destructive"
      : "bg-primary/10 text-primary";

  const EstadoIcon = cita.estado === "Finalizada" ? CheckCircle2 : AlertCircle;

  // El paciente NO debe ver diagnóstico, observaciones ni imágenes clínicas: solo la receta.
  const mostrarHistorialClinico = viewAs === "doctor";
  const mostrarReceta = viewAs === "paciente" && cita.receta;

  return (
    <div className="health-card border border-border p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoColor}`}>
              <EstadoIcon className="h-3 w-3" />
              {cita.estado}
            </span>
          </div>
          <h3 className="font-semibold text-foreground">{cita.motivo}</h3>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {viewAs === "paciente" && doctor && (
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {doctor.nombre}
              </span>
            )}
            {viewAs === "doctor" && paciente && (
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {paciente.nombre}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {cita.fecha}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {cita.hora}
            </span>
          </div>

          {mostrarHistorialClinico && cita.diagnostico && (
            <div className="mt-3 rounded-md bg-muted p-3">
              <p className="text-sm font-medium text-foreground">Diagnóstico:</p>
              <p className="mt-1 text-sm text-muted-foreground">{cita.diagnostico}</p>
              {cita.observaciones && (
                <p className="mt-1 text-xs italic text-muted-foreground">{cita.observaciones}</p>
              )}
            </div>
          )}

          {mostrarHistorialClinico && cita.receta && (
            <div className="mt-3 rounded-md border border-accent/30 bg-accent/5 p-3">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Pill className="h-3.5 w-3.5 text-accent" />
                Receta entregada:
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{cita.receta}</p>
            </div>
          )}

          {mostrarReceta && (
            <div className="mt-3 rounded-md border border-accent/30 bg-accent/5 p-3">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Pill className="h-3.5 w-3.5 text-accent" />
                Receta médica:
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{cita.receta}</p>
            </div>
          )}

          {viewAs === "paciente" && cita.estado === "Finalizada" && !cita.receta && (
            <p className="mt-3 text-xs italic text-muted-foreground">El médico no emitió receta para esta consulta.</p>
          )}
        </div>
        {mostrarHistorialClinico && cita.imagen && (
          <img src={cita.imagen} alt="Imagen médica" className="ml-4 h-16 w-16 rounded-lg object-cover" />
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {viewAs === "doctor" && cita.estado === "Pendiente" && onDiagnosticar && (
          <button
            onClick={() => onDiagnosticar(cita)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Diagnosticar
          </button>
        )}
        {viewAs === "doctor" && cita.estado === "Finalizada" && onDescargarPDF && (
          <button
            onClick={() => onDescargarPDF(cita)}
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <FileText className="h-4 w-4" />
            PDF historial
          </button>
        )}
        {viewAs === "paciente" && cita.estado === "Finalizada" && cita.receta && onDescargarReceta && (
          <button
            onClick={() => onDescargarReceta(cita)}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <Pill className="h-4 w-4" />
            Descargar receta (PDF)
          </button>
        )}
      </div>
    </div>
  );
}
