// Types
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: "paciente" | "doctor";
  especialidad_principal?: string;
  favorito?: number; // doctorId
}

export interface Cita {
  id: number;
  pacienteId: number;
  doctorId: number;
  fecha: string;
  hora: string;
  motivo: string;
  diagnostico?: string;
  observaciones?: string;
  imagen?: string;
  estado: "Pendiente" | "Finalizada" | "Cancelada";
}

export const ESPECIALIDADES = [
  "Medicina General",
  "Cardiología",
  "Dermatología",
  "Pediatría",
  "Traumatología",
  "Neurología",
  "Oftalmología",
  "Ginecología",
] as const;

// Seed data
const SEED_DOCTORS: Usuario[] = [
  { id: 1, nombre: "Dra. María García", email: "maria@salud.com", password: "1234", rol: "doctor", especialidad_principal: "Cardiología" },
  { id: 2, nombre: "Dr. Juan Pérez", email: "juan@salud.com", password: "1234", rol: "doctor", especialidad_principal: "Medicina General" },
  { id: 3, nombre: "Dra. Ana López", email: "ana@salud.com", password: "1234", rol: "doctor", especialidad_principal: "Dermatología" },
  { id: 4, nombre: "Dr. Carlos Ruiz", email: "carlos@salud.com", password: "1234", rol: "doctor", especialidad_principal: "Pediatría" },
  { id: 5, nombre: "Dra. Laura Martínez", email: "laura@salud.com", password: "1234", rol: "doctor", especialidad_principal: "Neurología" },
  { id: 6, nombre: "Dr. Roberto Sánchez", email: "roberto@salud.com", password: "1234", rol: "doctor", especialidad_principal: "Traumatología" },
];

const SEED_PATIENT: Usuario = {
  id: 100,
  nombre: "Pedro Ramírez",
  email: "pedro@email.com",
  password: "1234",
  rol: "paciente",
  favorito: 1,
};

const SEED_CITAS: Cita[] = [
  { id: 1, pacienteId: 100, doctorId: 1, fecha: "2026-04-10", hora: "09:00", motivo: "Control cardíaco", diagnostico: "Presión arterial elevada. Se recomienda dieta baja en sodio y seguimiento en 30 días.", observaciones: "Paciente presenta estrés laboral.", imagen: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400", estado: "Finalizada" },
  { id: 2, pacienteId: 100, doctorId: 2, fecha: "2026-04-15", hora: "10:30", motivo: "Chequeo general", estado: "Pendiente" },
  { id: 3, pacienteId: 100, doctorId: 3, fecha: "2026-04-20", hora: "14:00", motivo: "Revisión dermatológica", estado: "Pendiente" },
];

// localStorage helpers
const isBrowser = typeof window !== "undefined";

function initData() {
  if (!isBrowser) return;
  if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify([...SEED_DOCTORS, SEED_PATIENT]));
  }
  if (!localStorage.getItem("citas")) {
    localStorage.setItem("citas", JSON.stringify(SEED_CITAS));
  }
}

export function getUsuarios(): Usuario[] {
  if (!isBrowser) return [...SEED_DOCTORS, SEED_PATIENT];
  initData();
  return JSON.parse(localStorage.getItem("usuarios") || "[]");
}

export function setUsuarios(usuarios: Usuario[]) {
  if (!isBrowser) return;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

export function getCitas(): Cita[] {
  if (!isBrowser) return [];
  initData();
  return JSON.parse(localStorage.getItem("citas") || "[]");
}

export function setCitas(citas: Cita[]) {
  if (!isBrowser) return;
  localStorage.setItem("citas", JSON.stringify(citas));
}

export function getSesion(): Usuario | null {
  if (!isBrowser) return null;
  const s = localStorage.getItem("sesionActual");
  return s ? JSON.parse(s) : null;
}

export function setSesion(u: Usuario | null) {
  if (!isBrowser) return;
  if (u) localStorage.setItem("sesionActual", JSON.stringify(u));
  else localStorage.removeItem("sesionActual");
}

export function login(email: string, password: string): Usuario | null {
  const usuarios = getUsuarios();
  const u = usuarios.find((u) => u.email === email && u.password === password);
  if (u) setSesion(u);
  return u || null;
}

export function registrar(data: { nombre: string; email: string; password: string; rol: "paciente" | "doctor"; especialidad_principal?: string }): Usuario | null {
  const usuarios = getUsuarios();
  if (usuarios.find((u) => u.email === data.email)) return null;
  const nuevo: Usuario = { ...data, id: Date.now() };
  usuarios.push(nuevo);
  setUsuarios(usuarios);
  setSesion(nuevo);
  return nuevo;
}

export function logout() {
  setSesion(null);
}

export function getDoctores(): Usuario[] {
  return getUsuarios().filter((u) => u.rol === "doctor");
}

export function getDoctorById(id: number): Usuario | undefined {
  return getUsuarios().find((u) => u.id === id && u.rol === "doctor");
}

export function setFavorito(pacienteId: number, doctorId: number) {
  const usuarios = getUsuarios();
  const i = usuarios.findIndex((u) => u.id === pacienteId);
  if (i !== -1) {
    usuarios[i].favorito = doctorId;
    setUsuarios(usuarios);
    setSesion(usuarios[i]);
  }
}

export function guardarDiagnostico(citaId: number, diagnostico: string, observaciones: string, imagen: string) {
  const citas = getCitas();
  const i = citas.findIndex((c) => c.id === citaId);
  if (i !== -1) {
    citas[i].diagnostico = diagnostico;
    citas[i].observaciones = observaciones;
    citas[i].imagen = imagen;
    citas[i].estado = "Finalizada";
    setCitas(citas);
  }
}

export function agendarCita(pacienteId: number, doctorId: number, fecha: string, hora: string, motivo: string): Cita {
  const citas = getCitas();
  const nueva: Cita = { id: Date.now(), pacienteId, doctorId, fecha, hora, motivo, estado: "Pendiente" };
  citas.push(nueva);
  setCitas(citas);
  return nueva;
}
