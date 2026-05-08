'use client'
import {
    Box, Typography, Paper, Grid, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Stack,
    Button,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import PrintIcon from '@mui/icons-material/Print';
import { printConsultation } from '@/components/consultation/print/PrintConsultation';

export default function ConsultationDetail({ consultation }: { consultation: any }) {

    const router = useRouter();

    const getPrescription = () => {
        try {
            return JSON.parse(consultation.medicalPrescription || '[]');
        } catch {
            return [];
        }
    };

    const getInterrogation = () => {
        try {
            const parsed = JSON.parse(consultation.interrogation || '{}');

            if (
                typeof parsed === 'object' &&
                parsed !== null &&
                (
                    'chiefComplaint' in parsed ||
                    'currentIllness' in parsed ||
                    'symptoms' in parsed ||
                    'evolution' in parsed ||
                    'notes' in parsed ||
                    'studyResults' in parsed
                )
            ) {
                return parsed;
            }

            return null;
        } catch {
            return null;
        }
    };

    const prescription = getPrescription();
    const interrogation = getInterrogation();
    const studyResults = interrogation?.studyResults || [];

    const studyOrders = consultation.studyOrders
        ? consultation.studyOrders
            .split('\n')
            .map((order: string) => order.replace('- ', '').trim())
            .filter(Boolean)
        : [];

    const vitalSigns = [
        { label: 'Peso', value: consultation.weight ? `${consultation.weight} kg` : '--' },
        { label: 'Talla', value: consultation.height ? `${consultation.height} cm` : '--' },
        { label: 'Presión arterial', value: consultation.bloodPressure || '--' },
        { label: 'Temperatura', value: consultation.temperature ? `${consultation.temperature} °C` : '--' },
        { label: 'Glucosa', value: consultation.glucose ? `${consultation.glucose} mg/dL` : '--' },
    ];

    // Datos para imprimir
    const doctor = consultation.doctor || consultation.appointment?.doctor;
    const doctorProfile = doctor?.doctorProfile;

    const handlePrintPrescription = () => {
        printConsultation({
            consultation,
            prescription,
            interrogation,
            studyResults,
            studyOrders,
            doctor,
            doctorProfile,
            patient: consultation.patient,
        });
    };


    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                        <Button
                            startIcon={<ArrowBack />}
                            onClick={() => router.back()}
                            color="inherit"
                        >
                            Volver al paciente
                        </Button>

                        <Button
                            startIcon={<PrintIcon />}
                            onClick={handlePrintPrescription}
                            variant="contained"
                            color="success"
                            size="small"
                        >
                            Imprimir receta
                        </Button>
                    </Stack>

                    <Paper
                        sx={{
                            p: { xs: 2, sm: 3 },
                            borderRadius: 2,
                            borderLeft: '6px solid',
                            borderColor: 'primary.main',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}
                        >
                            <MonitorHeartIcon color="primary" />
                            Signos Vitales y Medidas
                        </Typography>

                        <Grid container spacing={2}>
                            {vitalSigns.map((item) => (
                                <Grid key={item.label} size={{ xs: 6, sm: 4, md: 2.4 }}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            height: '100%',
                                            bgcolor: 'grey.50',
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary">
                                            {item.label}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>
                                            {item.value}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Paper
                        sx={{
                            p: { xs: 2, sm: 3 },
                            borderRadius: 2,
                            borderLeft: '6px solid',
                            borderColor: 'success.main',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}
                        >
                            <PersonIcon color="success" />
                            Médico Responsable
                        </Typography>

                        {doctor ? (
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <InfoBlock label="Nombre" value={doctor.fullName} />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <InfoBlock label="Correo" value={doctor.email} />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <InfoBlock label="Rol" value={doctor.role} />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <InfoBlock
                                        label="Cédula profesional"
                                        value={doctorProfile?.professionalLicense || 'No registrada'}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <InfoBlock
                                        label="Especialidad"
                                        value={doctorProfile?.specialty || 'No registrada'}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <InfoBlock
                                        label="Subespecialidad"
                                        value={doctorProfile?.subspecialty || 'No registrada'}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <InfoBlock
                                        label="Universidad"
                                        value={doctorProfile?.university || 'No registrada'}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <InfoBlock
                                        label="Teléfono profesional"
                                        value={doctorProfile?.phone || 'No registrado'}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <InfoBlock
                                        label="Consultorio"
                                        value={doctorProfile?.office || 'No registrado'}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No se registró médico responsable para esta consulta.
                            </Typography>
                        )}
                    </Paper>
                </Grid>


                <Grid size={{ xs: 12, lg: 7 }}>
                    <Stack spacing={3}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                                    >
                                        <AssignmentIcon color="action" />
                                        Interrogatorio
                                    </Typography>

                                    {interrogation ? (
                                        <Stack spacing={2}>
                                            <InfoBlock
                                                label="Motivo de consulta"
                                                value={interrogation.chiefComplaint}
                                            />
                                            <InfoBlock
                                                label="Padecimiento actual"
                                                value={interrogation.currentIllness}
                                            />
                                            <InfoBlock
                                                label="Síntomas referidos"
                                                value={interrogation.symptoms}
                                            />
                                            <InfoBlock
                                                label="Evolución"
                                                value={interrogation.evolution}
                                            />
                                            <InfoBlock
                                                label="Notas adicionales"
                                                value={interrogation.notes}
                                            />
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                            {consultation.interrogation || 'No se registró interrogatorio.'}
                                        </Typography>
                                    )}
                                </Paper>
                            </Grid>


                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
                                    >
                                        <LocalHospitalIcon color="action" />
                                        Examen Físico
                                    </Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                        {consultation.physicalExam || 'No se registraron hallazgos físicos.'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Paper
                            sx={{
                                p: { xs: 2, sm: 3 },
                                bgcolor: 'primary.50',
                                borderLeft: '6px solid',
                                borderColor: 'primary.main',
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                                <MedicalInformationIcon color="primary" />
                                Diagnóstico Definitivo / Presuntivo
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                                {consultation.diagnosis || 'Sin diagnóstico registrado.'}
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, lg: 5 }}>
                    <Stack spacing={3}>
                        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                            <Typography
                                variant="h6"
                                sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}
                            >
                                <MedicationIcon color="success" />
                                Receta Médica
                            </Typography>

                            {prescription.length > 0 ? (
                                <TableContainer sx={{ overflowX: 'auto' }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                                            <TableRow>
                                                <TableCell> <strong>Medicamento</strong></TableCell>
                                                <TableCell> <strong>Dosis</strong></TableCell>
                                                <TableCell> <strong>Frecuencia</strong></TableCell>
                                                <TableCell> <strong>Duración</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {prescription.map((med: any, index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell>{med.name || '--'}</TableCell>
                                                    <TableCell>{med.dose || '--'}</TableCell>
                                                    <TableCell>{med.frequency || '--'}</TableCell>
                                                    <TableCell>{med.duration || '--'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No se recetaron medicamentos.
                                </Typography>
                            )}
                        </Paper>

                        {interrogation && studyResults.length > 0 && (
                            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                    <ScienceIcon color="primary" />
                                    Resultados de Estudios
                                </Typography>

                                <Stack spacing={2}>
                                    {studyResults.map((item: any, index: number) => (
                                        <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                {item.studyName || 'Estudio sin nombre'}
                                            </Typography>

                                            <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                                                {item.result || 'Sin resultado registrado.'}
                                            </Typography>

                                            {item.observations && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ display: 'block', mt: 1, whiteSpace: 'pre-line' }}
                                                >
                                                    Observaciones: {item.observations}
                                                </Typography>
                                            )}
                                        </Paper>
                                    ))}
                                </Stack>
                            </Paper>
                        )}

                        <Paper
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderLeft: studyOrders.length ? '6px solid' : undefined,
                                borderColor: 'warning.main',
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                                <ScienceIcon color="warning" />
                                Estudios Solicitados
                            </Typography>

                            {studyOrders.length > 0 ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {studyOrders.map((order: string, index: number) => (
                                        <Chip key={`${order}-${index}`} label={order} variant="outlined" />
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No se solicitaron estudios.
                                </Typography>
                            )}
                        </Paper>

                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

function InfoBlock({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    if (!value) return null;

    return (
        <Box>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {value}
            </Typography>
        </Box>
    );
}


