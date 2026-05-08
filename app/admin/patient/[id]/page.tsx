'use client';

import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    Chip,
    Button,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Stack,
    Alert,
    Skeleton,
    Toolbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';
import { getPatientById } from '@/app/actions/patients/patients';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { Event, Padding } from '@mui/icons-material';
import { FormatDateWhitOutTimeZone } from '@/helpers/helperdate';
// Import para drawer
import {
    Drawer,
    IconButton,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import CloseIcon from '@mui/icons-material/Close';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import HeightIcon from '@mui/icons-material/Height';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PatientDetailsPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [patient, setPatient] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [growthDrawerOpen, setGrowthDrawerOpen] = useState(false);

    useEffect(() => {
        getPatientById(id)
            .then((data) => {
                if (data) setPatient(data);
            })
            .finally(() => setLoading(false));
    }, [id]);

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

    const getGenderLabel = (gender?: string) => {
        if (gender === 'M') return 'Masculino';
        if (gender === 'F') return 'Femenino';
        if (gender === 'O') return 'Otro';
        return 'No registrado';
    };

    if (loading) {
        return (
            <Box sx={{ px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 2, sm: 4 } }}>
                <Skeleton variant="rounded" height={80} sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Skeleton variant="rounded" height={420} />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Skeleton variant="rounded" height={420} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (!patient) {
        return (
            <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
                <Alert severity="warning">No se encontró el expediente del paciente.</Alert>
            </Box>
        );
    }

    const consultations = patient.consultations || [];
    const growthHistory = patient.growthHistory || [];

    const pendingAppointments = (patient.appointments || [])
        .filter((appointment: any) =>
            ['PENDING', 'CONFIRMED'].includes(appointment.status)
        )
        .sort(
            (a: any, b: any) =>
                new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
        );


    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Box sx={{ mx: 'auto' }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    sx={{ mb: 3, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: "space-between" }}
                    spacing={2}
                >
                    <Box>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            component={Link}
                            href="/admin/patient/index"
                            color="inherit"
                        >
                            Volver a la lista
                        </Button>
                    </Box>

                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        sx={{ mb: 3, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: "space-between" }}
                    >
                        <Button variant="outlined" startIcon={<EditIcon />} size="small" sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start', md: 'center' } }} >
                            Editar Perfil
                        </Button>

                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<MedicalServicesIcon />}
                            component={Link}
                            href={`/admin/consultation/patient/${patient.id}/create`}
                            size="small"
                        >
                            Iniciar Consulta
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            href={`/admin/appointmen/create?patientId=${patient.id}`}
                            startIcon={<Event />}
                            size="small"
                        >
                            Nueva Cita
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<TimelineIcon />}
                            size="small"
                            onClick={() => setGrowthDrawerOpen(true)}
                        >
                            Histórico Peso/Talla
                        </Button>
                    </Stack>
                </Stack>

                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        mb: 3,
                        borderRadius: 3,
                        borderLeft: '6px solid',
                        borderColor: 'primary.main',
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: "space-between" }}
                        spacing={2}
                    >
                        <Box>
                            <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                                {patient.fullName}
                            </Typography>

                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Chip icon={<BadgeIcon />} label={`ID: ${patient.documentId}`} size="small" />
                                <Chip icon={<PersonIcon />} label={getGenderLabel(patient.gender)} size="small" variant="outlined" />
                                <Chip label={`${getAge(patient.birthDate)} años`} size="small" variant="outlined" />
                            </Stack>
                        </Box>

                        <Chip
                            icon={<HistoryIcon />}
                            label={`${consultations.length} consulta${consultations.length === 1 ? '' : 's'}`}
                            color="primary"
                            variant="outlined"
                            sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}
                        />
                    </Stack>
                </Paper>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, lg: 4 }}>
                        <Stack spacing={3}>
                            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                    Datos del Paciente
                                </Typography>

                                <Stack spacing={2}>
                                    <InfoRow
                                        icon={<CakeIcon color="action" />}
                                        label="Fecha de nacimiento"
                                        value={FormatDateWhitOutTimeZone(patient.birthDate)}
                                    />

                                    <InfoRow
                                        icon={<BloodtypeIcon color="error" />}
                                        label="Grupo sanguíneo"
                                        value={patient.bloodType || 'No registrado'}
                                        strong
                                    />

                                    <InfoRow
                                        icon={<PhoneIcon color="action" />}
                                        label="Teléfono"
                                        value={patient.phone || 'Sin teléfono registrado'}
                                    />

                                    <InfoRow
                                        icon={<EmailIcon color="action" />}
                                        label="Correo"
                                        value={patient.email || 'Sin correo registrado'}
                                    />
                                </Stack>
                            </Paper>

                            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                    Antecedentes Médicos
                                </Typography>

                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    Alergias
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                    {patient.allergies || 'Ninguna conocida'}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                    Enfermedades crónicas
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                    {patient.chronicDiseases || 'Sin antecedentes registrados'}
                                </Typography>
                            </Paper>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 8 }}>

                        <Card sx={{ borderRadius: 3, mb: 3 }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    sx={{ mb: 2, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: "space-between" }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}
                                    >
                                        <EventAvailableIcon color="primary" />
                                        Citas Pendientes
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        component={Link}
                                        href={`/admin/appointmen/create?patientId=${patient.id}`}
                                        startIcon={<Event />}
                                        size="small"
                                    >
                                        Agendar Cita
                                    </Button>
                                </Stack>

                                <List disablePadding>
                                    {pendingAppointments.length > 0 ? (
                                        pendingAppointments.map((appointment: any, index: number) => (
                                            <ListItem
                                                key={appointment.id}
                                                divider={index !== pendingAppointments.length - 1}
                                                sx={{
                                                    px: 0,
                                                    py: 2,
                                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    gap: { xs: 1.5, sm: 2 },
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography sx={{ fontWeight: 700 }}>
                                                            {new Date(appointment.startDateTime).toLocaleDateString()} -{' '}
                                                            {new Date(appointment.startDateTime).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                            {" | Doctor: " + appointment.doctor?.fullName}
                                                        </Typography>
                                                    }
                                                    secondary={appointment.reason || 'Sin motivo registrado'}
                                                />

                                                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }} >
                                                    <Chip
                                                        size="small"
                                                        label={appointment.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                                                        color={appointment.status === 'CONFIRMED' ? 'info' : 'warning'}
                                                    />

                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="success"
                                                        component={Link}
                                                        href={`/admin/consultation/patient/${patient.id}/create?appointmentId=${appointment.id}`}
                                                    >
                                                        Iniciar
                                                    </Button>
                                                </Stack>
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Box sx={{ py: 4, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No hay citas pendientes para este paciente.
                                            </Typography>
                                        </Box>
                                    )}
                                </List>
                            </CardContent>
                        </Card>

                        <Card sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    sx={{ mb: 2, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: "space-between" }}
                                    spacing={2}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}
                                    >
                                        <HistoryIcon color="primary" />
                                        Historial Clínico
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        startIcon={<EventAvailableIcon />}
                                        component={Link}
                                        href={`/admin/consultation/patient/${patient.id}/create`}
                                        size="small"
                                    >
                                        Nueva Consulta
                                    </Button>
                                </Stack>

                                <List disablePadding>
                                    {consultations.length > 0 ? (
                                        consultations.map((consult: any, index: number) => (
                                            <ListItem
                                                key={consult.id}
                                                divider={index !== consultations.length - 1}
                                                sx={{
                                                    px: 0,
                                                    py: 2,
                                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                    gap: { xs: 1.5, sm: 2 },
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography sx={{ fontWeight: 700 }}>
                                                            Consulta médica | Fecha: {new Date(consult.date).toLocaleDateString()} | Dr: {consult.doctor?.fullName}
                                                        </Typography>
                                                    }
                                                    secondary={`Diagnóstico: ${consult.diagnosis || 'Pendiente'}`}
                                                />

                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    component={Link}
                                                    href={`/admin/consultation/${consult.id}`}
                                                    sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
                                                >
                                                    Ver detalles
                                                </Button>
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Box sx={{ py: 6, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Inicia una consulta para comenzar el historial clínico.
                                            </Typography>
                                        </Box>
                                    )}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            <Drawer
                anchor="right"
                open={growthDrawerOpen}
                onClose={() => setGrowthDrawerOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: '100%', sm: 420 },
                            p: 3,
                        },
                    }
                }}
            >
                <Toolbar variant="dense" />
                <Stack spacing={3}>
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Histórico Peso/Talla
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Registros ordenados del más reciente al más antiguo
                            </Typography>
                        </Box>

                        <IconButton onClick={() => setGrowthDrawerOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <Divider />

                    {growthHistory.length > 0 ? (
                        <Stack spacing={2}>
                            {growthHistory.map((item: any) => (
                                <Paper
                                    key={item.id}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                        {FormatDateWhitOutTimeZone(item.date)}
                                    </Typography>

                                    <Stack direction="row" spacing={2}>
                                        <Chip
                                            icon={<MonitorWeightIcon />}
                                            label={item.weight ? `${item.weight} kg` : 'Peso no registrado'}
                                            color={item.weight ? 'primary' : 'default'}
                                            variant="outlined"
                                        />

                                        <Chip
                                            icon={<HeightIcon />}
                                            label={item.height ? `${item.height} cm` : 'Talla no registrada'}
                                            color={item.height ? 'success' : 'default'}
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    ) : (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <TimelineIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                No hay registros de peso y talla para este paciente.
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Drawer>

        </Box >
    );
}

function InfoRow({
    icon,
    label,
    value,
    strong = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    strong?: boolean;
}) {
    return (
        <Stack direction="row" spacing={1.5}>
            <Box sx={{ mt: 0.3 }}>{icon}</Box>
            <Box>
                <Typography variant="caption" color="text.secondary">
                    {label}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: strong ? 700 : 400,
                        color: strong ? 'error.main' : 'text.primary',
                        overflowWrap: 'anywhere',
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Stack>
    );
}
