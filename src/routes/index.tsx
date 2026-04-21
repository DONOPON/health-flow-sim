import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, Stethoscope, UserCheck, Shield, ArrowRight, Users, UserPlus, Wifi } from "lucide-react";
import { getSesion } from "@/lib/data";
import { useState, useEffect, useCallback } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SaludDigital - Portal de Salud Digital" },
      {
        name: "description",
        content: "Tu portal de salud digital. Agenda citas, consulta tu historial clínico y descarga tus diagnósticos.",
      },
      { property: "og:title", content: "SaludDigital - Portal de Salud Digital" },
      {
        property: "og:description",
        content: "Tu portal de salud digital. Agenda citas, consulta tu historial clínico y descarga tus diagnósticos.",
      },
    ],
  }),
  component: Index,
});

const sliderImages = [
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1920&q=80",
];

function Index() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sesion, setSesion] = useState<ReturnType<typeof getSesion>>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  }, []);

  useEffect(() => {
    setSesion(getSesion());
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    if (!sesion) return;

    navigate({
      to: sesion.rol === "paciente" ? "/dashboard-paciente" : "/dashboard-doctor",
      replace: true,
    });
  }, [sesion, navigate]);

  if (sesion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {sliderImages.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === currentSlide ? 1 : 0 }}
          >
            <img
              src={src}
              alt={`Imagen médica ${i + 1}`}
              className="h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Heart className="h-4 w-4" />
              Portal de Salud Digital
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Tu salud, centralizada y accesible
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Agenda citas, consulta tu historial clínico y descarga tus diagnósticos. Todo en un solo lugar.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/registro"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Crear cuenta
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {sliderImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-white" : "w-2.5 bg-white/50"
              }`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-primary px-4 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 sm:gap-16">
          {[
            { icon: Users, value: "500+", label: "Pacientes atendidos" },
            { icon: UserPlus, value: "20+", label: "Médicos registrados" },
            { icon: Wifi, value: "100%", label: "Digital" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 text-primary-foreground">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/75">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      <footer className="border-t border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        <p>SaludDigital — Prototipo funcional de Portal de Salud Digital</p>
      </footer>
    </div>
  );
}
