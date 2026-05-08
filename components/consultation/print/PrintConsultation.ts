type PrintConsultationInput = {
    consultation: any;
    prescription: any[];
    interrogation: any;
    studyResults: any[];
    studyOrders: string[];
    doctor: any;
    doctorProfile: any;
    patient: any;
};

const escapeHtml = (value: any) => {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
};

const getAge = (birthDate: Date | string) => {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

export function printConsultation({
    consultation,
    prescription,
    interrogation,
    studyResults,
    studyOrders,
    doctor,
    doctorProfile,
    patient,
}: PrintConsultationInput) {
    const consultationDate = consultation.date
        ? new Date(consultation.date).toLocaleDateString()
        : new Date().toLocaleDateString();

    const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Consulta médica</title>
        <style>
          @page { size: letter; margin: 8mm; }

          * { box-sizing: border-box; }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #172033;
            font-size: 9.8px;
            background: #fff;
          }

          .topbar {
            height: 4px;
            background: #1976d2;
            margin-bottom: 10px;
          }

          .header {
            display: grid;
            grid-template-columns: 1.6fr 0.8fr;
            gap: 16px;
            padding-bottom: 9px;
            border-bottom: 1px solid #cfd8e3;
            margin-bottom: 10px;
          }

          .doctor-name {
            font-size: 15px;
            font-weight: 800;
            margin: 0 0 2px;
            color: #0f2942;
          }

          .doctor-meta {
            margin: 0;
            color: #4a5568;
            line-height: 1.2;
            font-size: 8.8px;
          }

          .doc-title {
            text-align: right;
          }

          .doc-title h1 {
            margin: 0;
            font-size: 14px;
            font-weight: 800;
            color: #1976d2;
          }

          .doc-title p {
            margin: 2px 0 0;
            color: #4a5568;
            font-size: 8.8px;
          }

          .patient-card {
            border: 1px solid #d5dde7;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 9px;
            background: #f8fafc;
          }

          .patient-name {
            font-size: 11.5px;
            font-weight: 800;
            margin: 0 0 5px;
            color: #0f2942;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 5px 10px;
          }

          .field-label {
            margin: 0 0 1px;
            font-size: 7.2px;
            text-transform: uppercase;
            color: #718096;
            font-weight: 700;
          }

          .field-value {
            margin: 0;
            font-size: 9.2px;
            color: #1a202c;
            line-height: 1.12;
          }

          .section {
            margin-bottom: 8px;
            break-inside: avoid;
          }

          .section-title {
            display: flex;
            align-items: center;
            gap: 4px;
            margin: 0 0 4px;
            font-size: 9.4px;
            font-weight: 800;
            color: #0f2942;
            text-transform: uppercase;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
          }

          .section-title::before {
            content: "";
            width: 4px;
            height: 10px;
            border-radius: 4px;
            background: #1976d2;
            display: inline-block;
          }

          .body-text {
            margin: 0;
            font-size: 9.4px;
            line-height: 1.28;
            color: #1a202c;
            white-space: pre-line;
          }

          .subsection {
            margin-bottom: 4px;
          }

          .subsection-title {
            margin: 0 0 1px;
            font-size: 7.5px;
            color: #718096;
            font-weight: 800;
            text-transform: uppercase;
          }

          .interrogation-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px 16px;
          }

          .interrogation-grid .subsection {
            margin-bottom: 0;
            break-inside: avoid;
          }

          .interrogation-grid .wide {
            grid-column: span 2;
          }

          .two-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }

          .item-list {
            display: grid;
            gap: 4px;
          }

          .item {
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 5px 6px;
            break-inside: avoid;
            background: #fff;
          }

          .item-title {
            margin: 0 0 1px;
            font-size: 9.4px;
            font-weight: 800;
            color: #0f2942;
          }

          .item-detail {
            margin: 0;
            font-size: 9.2px;
            color: #1a202c;
            line-height: 1.25;
          }

          .compact-list {
            display: grid;
            gap: 3px;
          }

          .compact-line {
            margin: 0;
            font-size: 9.3px;
            line-height: 1.28;
          }

          .footer {
            display: flex;
            justify-content: flex-end;
            margin-top: 26px;
            break-inside: avoid;
          }

          .signature {
            width: 230px;
            text-align: center;
            border-top: 1px solid #1a202c;
            padding-top: 5px;
          }

          .signature-name {
            margin: 0 0 1px;
            font-size: 9.5px;
            font-weight: 800;
            color: #0f2942;
          }

          .signature-meta {
            margin: 0;
            font-size: 8.5px;
            color: #4a5568;
          }

          .muted { color: #4a5568; }
        </style>
      </head>

      <body>
        <div class="topbar"></div>

        <header class="header">
          <div>
            <p class="doctor-name">${escapeHtml(doctor?.fullName || 'Médico no registrado')}</p>
            <p class="doctor-meta">
              ${escapeHtml(doctorProfile?.specialty || 'Especialidad no registrada')}
              ${doctorProfile?.subspecialty ? ` | ${escapeHtml(doctorProfile.subspecialty)}` : ''}
            </p>
            <p class="doctor-meta">Cédula profesional: ${escapeHtml(doctorProfile?.professionalLicense || 'No registrada')}</p>
            <p class="doctor-meta">
              ${doctorProfile?.office ? `Consultorio: ${escapeHtml(doctorProfile.office)}` : ''}
              ${doctorProfile?.phone ? ` | Tel: ${escapeHtml(doctorProfile.phone)}` : ''}
            </p>
            <p class="doctor-meta">${escapeHtml(doctor?.email || '')}</p>
          </div>

          <div class="doc-title">
            <h1>Consulta médica</h1>
            <p>Fecha: ${escapeHtml(consultationDate)}</p>
          </div>
        </header>

        <section class="patient-card">
          <p class="patient-name">${escapeHtml(patient?.fullName || 'Paciente no registrado')}</p>

          <div class="info-grid">
            ${field('Documento', patient?.documentId)}
            ${field('Edad', patient?.birthDate ? `${getAge(patient.birthDate)} años` : '--')}
            ${field('Género', patient?.gender)}
            ${field('Grupo', patient?.bloodType)}
            ${field('Presión', consultation.bloodPressure)}
            ${field('Peso', consultation.weight ? `${consultation.weight} kg` : '--')}
            ${field('Talla', consultation.height ? `${consultation.height} cm` : '--')}
            ${field('Temp.', consultation.temperature ? `${consultation.temperature} °C` : '--')}
            ${field('Glucosa', consultation.glucose ? `${consultation.glucose} mg/dL` : '--')}
          </div>
        </section>

        ${interrogationSection(interrogation, consultation)}
        ${clinicalSection(consultation)}
        ${studyResultsSection(studyResults)}
        ${prescriptionSection(prescription)}
        ${studyOrdersSection(studyOrders)}

        <footer class="footer">
          <div class="signature">
            <p class="signature-name">${escapeHtml(doctor?.fullName || 'Médico responsable')}</p>
            <p class="signature-meta">Cédula: ${escapeHtml(doctorProfile?.professionalLicense || 'No registrada')}</p>
          </div>
        </footer>

        <script>
          window.onload = function () {
            window.focus();
            setTimeout(function () {
              window.print();
            }, 150);
          };
        </script>
      </body>
    </html>
  `;

    const printWindow = window.open('', '_blank', 'width=900,height=700');

    if (!printWindow) {
        alert('Permite ventanas emergentes para imprimir la consulta.');
        return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
}

function field(label: string, value: any) {
    return `
    <div>
      <p class="field-label">${escapeHtml(label)}</p>
      <p class="field-value">${escapeHtml(value || '--')}</p>
    </div>
  `;
}

function subsection(title: string, value: any, wide = false) {
    if (!value) return '';

    return `
    <div class="subsection ${wide ? 'wide' : ''}">
      <p class="subsection-title">${escapeHtml(title)}</p>
      <p class="body-text">${escapeHtml(value)}</p>
    </div>
  `;
}

function section(title: string, value: any) {
    return `
    <section class="section">
      <p class="section-title">${escapeHtml(title)}</p>
      <p class="body-text">${escapeHtml(value || '--')}</p>
    </section>
  `;
}

function interrogationSection(interrogation: any, consultation: any) {
    if (!interrogation) {
        return section('Interrogatorio', consultation.interrogation || 'No se registró interrogatorio.');
    }

    return `
    <section class="section">
      <p class="section-title">Interrogatorio</p>
      <div class="interrogation-grid">
        ${subsection('Motivo de consulta', interrogation.chiefComplaint)}
        ${subsection('Padecimiento actual', interrogation.currentIllness)}
        ${subsection('Síntomas referidos', interrogation.symptoms)}
        ${subsection('Evolución', interrogation.evolution)}
        ${subsection('Notas adicionales', interrogation.notes, true)}
      </div>
    </section>
  `;
}

function clinicalSection(consultation: any) {
    return `
    <div class="two-columns">
      ${section('Examen físico', consultation.physicalExam || 'No se registraron hallazgos físicos.')}
      ${section('Diagnóstico', consultation.diagnosis || 'Sin diagnóstico registrado.')}
    </div>
  `;
}

function studyResultsSection(studyResults: any[]) {
    if (!studyResults.length) return '';

    return `
    <section class="section">
      <p class="section-title">Resultados de estudios previos</p>
      <div class="item-list">
        ${studyResults.map((item, index) => `
          <div class="item">
            <p class="item-title">${index + 1}. ${escapeHtml(item.studyName || 'Estudio sin nombre')}</p>
            <p class="item-detail">${escapeHtml(item.result || 'Sin resultado registrado.')}</p>
            ${item.observations ? `<p class="item-detail muted">Observaciones: ${escapeHtml(item.observations)}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function prescriptionSection(prescription: any[]) {
    return `
    <section class="section">
      <p class="section-title">Prescripción</p>
      ${prescription.length > 0
            ? `
            <div class="compact-list">
              ${prescription.map((med, index) => `
                <p class="compact-line">
                  <strong>${index + 1}. ${escapeHtml(med.name || '--')}</strong>
                  · Dosis: ${escapeHtml(med.dose || '--')}
                  · Frecuencia: ${escapeHtml(med.frequency || '--')}
                  · Duración: ${escapeHtml(med.duration || '--')}
                </p>
              `).join('')}
            </div>
          `
            : `<p class="body-text">No se recetaron medicamentos.</p>`
        }
    </section>
  `;
}

function studyOrdersSection(studyOrders: string[]) {
    if (!studyOrders.length) return '';

    return `
    <section class="section">
      <p class="section-title">Estudios solicitados</p>
      <div class="compact-list">
        ${studyOrders.map((order, index) => `
          <p class="compact-line">${index + 1}. ${escapeHtml(order)}</p>
        `).join('')}
      </div>
    </section>
  `;
}
