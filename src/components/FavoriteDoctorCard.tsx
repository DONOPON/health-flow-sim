import { getDoctorById, type Usuario } from "@/lib/data";
import { Star, Calendar, Stethoscope } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function FavoriteDoctorCard({ paciente }: { paciente: Usuario }) {
  if (!paciente.favorito) return null;
  const doc = getDoctorById(paciente.favorito);
  if (!doc) return null;

  return (
    <div className="health-card border border-border p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-accent">
        <Star className="h-4 w-4 fill-current" />
        Médico favorito
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Stethoscope className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{doc.nombre}</h3>
          <p className="text-sm text-muted-foreground">{doc.especialidad_principal}</p>
        </div>
        <Link
          to="/agendar"
          search={{ doctorId: doc.id }}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Calendar className="h-4 w-4" />
          Agendar
        </Link>
      </div>
    </div>
  );
}
