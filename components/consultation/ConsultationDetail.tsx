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

export default function ConsultationDetail({ consultation }: { consultation: any }) {

    const router = useRouter();

    const getPrescription = () => {
        try {
            return JSON.parse(consultation.medicalPrescription || '[]');
        } catch {
            return [];
        }
    };

    const prescription = getPrescription();

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

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}
                        color="inherit"
                        sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, mb: 2 }}
                    >
                        Volver al paciente
                    </Button>
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

                <Grid size={{ xs: 12, lg: 7 }}>
                    <Stack spacing={3}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
                                    >
                                        <AssignmentIcon color="action" />
                                        Interrogatorio
                                    </Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                        {consultation.interrogation || 'No se registró interrogatorio.'}
                                    </Typography>
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
                                                <TableCell><strong>Medicamento</strong></TableCell>
                                                <TableCell><strong>Dosis</strong></TableCell>
                                                <TableCell><strong>Frecuencia</strong></TableCell>
                                                <TableCell><strong>Duración</strong></TableCell>
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
