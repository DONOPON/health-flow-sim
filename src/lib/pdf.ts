import { jsPDF } from "jspdf";
import { type Cita, getDoctorById, getUsuarios } from "./data";

export function generarPDFDiagnostico(cita: Cita) {
  const doc = new jsPDF();
  const doctor = getDoctorById(cita.doctorId);
  const paciente = getUsuarios().find((u) => u.id === cita.pacienteId);

  // Header
  doc.setFillColor(59, 130, 180);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("SaludDigital", 20, 20);
  doc.setFontSize(10);
  doc.text("Portal de Salud Digital - Diagnóstico Médico", 20, 30);

  // Content
  doc.setTextColor(30, 30, 60);
  let y = 55;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Información del Paciente", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nombre: ${paciente?.nombre || "N/A"}`, 20, y);
  y += 6;
  doc.text(`Fecha de consulta: ${cita.fecha}`, 20, y);
  y += 6;
  doc.text(`Hora: ${cita.hora}`, 20, y);
  y += 12;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Médico Tratante", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nombre: ${doctor?.nombre || "N/A"}`, 20, y);
  y += 6;
  doc.text(`Especialidad: ${doctor?.especialidad_principal || "N/A"}`, 20, y);
  y += 12;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Motivo de Consulta", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(cita.motivo, 20, y);
  y += 12;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Diagnóstico", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const diagLines = doc.splitTextToSize(cita.diagnostico || "Sin diagnóstico", 170);
  doc.text(diagLines, 20, y);
  y += diagLines.length * 5 + 8;

  if (cita.observaciones) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const obsLines = doc.splitTextToSize(cita.observaciones, 170);
    doc.text(obsLines, 20, y);
    y += obsLines.length * 5 + 8;
  }

  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 270, 190, 270);
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("Documento generado por SaludDigital - Portal de Salud Digital", 20, 278);
  doc.text(`Generado el: ${new Date().toLocaleDateString("es-ES")}`, 20, 283);

  doc.save(`diagnostico_${cita.id}.pdf`);
}
