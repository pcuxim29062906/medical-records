'use client';

import * as React from 'react';
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Drawer,
    IconButton,
    Stack,
    Tab,
    Tabs,
    Toolbar,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import PersonIcon from '@mui/icons-material/Person';

import { getPatientById } from '@/app/actions/patients/patients';

type PatientDetail = NonNullable<Awaited<ReturnType<typeof getPatientById>>>;

interface DetailPatientProps {
    id: string;
    buttonText?: string;
    renderButton?: (props: { onClick: () => void }) => React.ReactNode;
}

const formatDate = (value?: string | Date | null) => {
    if (!value) return 'Sin fecha';

    return new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'medium',
    }).format(new Date(value));
};

const formatDateTime = (value?: string | Date | null) => {
    if (!value) return 'Sin fecha';

    return new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
};

const getText = (
    source: Record<string, unknown> | null | undefined,
    keys: string[],
    fallback = 'No registrado',
) => {
    if (!source) return fallback;

    for (const key of keys) {
        const value = source[key];

        if (value !== null && value !== undefined && String(value).trim() !== '') {
            return String(value);
        }
    }

    return fallback;
};

const SectionTitle = ({
    icon,
    title,
    subtitle,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
}) => (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box
            sx={{
                width: 36,
                height: 36,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: 3
            }}
        >
            {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary" noWrap>
                    {subtitle}
                </Typography>
            )}
        </Box>
    </Stack>
);

const InfoItem = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => (
    <Box>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
    </Box>
);

const EmptyState = ({ text }: { text: string }) => (
    <Box
        sx={{
            minHeight: 140,
            display: 'grid',
            placeItems: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            bgcolor: 'grey.50',
            px: 2,
            textAlign: 'center',
            borderRadius: 3
        }}
    >
        <Typography variant="body2" color="text.secondary">
            {text}
        </Typography>
    </Box>
);

const DetailPatient = ({
    id,
    buttonText = 'Ver detalle',
    renderButton,
}: DetailPatientProps) => {
    const [open, setOpen] = React.useState(false);
    const [tab, setTab] = React.useState(0);
    const [patient, setPatient] = React.useState<PatientDetail | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const loadPatient = React.useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const result = await getPatientById(id);
            setPatient(result);
        } catch {
            setError('No se pudo cargar la información del paciente.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    const handleOpen = async () => {
        setOpen(true);

        if (!patient) {
            await loadPatient();
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const patientName = getText(patient, ['fullName', 'name', 'names'], 'Paciente');
    const patientEmail = getText(patient, ['email']);
    const patientPhone = getText(patient, ['phone', 'phoneNumber', 'cellphone']);
    const patientGender = getText(patient, ['gender', 'sex']);
    const patientBloodType = getText(patient, ['bloodType']);
    const patientBirthDate = getText(patient, ['birthDate', 'dateOfBirth'], '');

    return (
        <>
            {renderButton ? (
                renderButton({ onClick: handleOpen })
            ) : (
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={handleOpen}
                >
                    {buttonText}
                </Button>
            )}

            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: '100%', sm: 520 },
                            maxWidth: '100%',
                        },
                    },
                }}
            >
                <Toolbar variant="dense" />
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Stack
                        direction="row"
                        sx={{ px: 2, py: 1.5, alignItems: "center", justifyContent: "space-between" }}
                    >
                        <Stack direction="row" spacing={1.5} sx={{ minWidth: 0, alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <PersonIcon />
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }} noWrap>
                                    {patientName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    Expediente clínico del paciente
                                </Typography>
                            </Box>
                        </Stack>

                        <IconButton onClick={handleClose} edge="end" aria-label="Cerrar detalle">
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <Divider />

                    {loading && (
                        <Stack sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <CircularProgress size={30} />
                            <Typography sx={{ mt: 2 }} color="text.secondary">
                                Cargando expediente...
                            </Typography>
                        </Stack>
                    )}

                    {!loading && error && (
                        <Box sx={{ p: 2 }}>
                            <EmptyState text={error} />
                        </Box>
                    )}

                    {!loading && !error && patient && (
                        <>
                            <Box sx={{ px: 2, py: 2 }}>
                                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }} >
                                    <Chip size="small" label={`Tel: ${patientPhone}`} />
                                    <Chip size="small" label={`Sexo: ${patientGender}`} />
                                    <Chip size="small" label={`Sangre: ${patientBloodType}`} />
                                </Stack>
                            </Box>

                            <Tabs
                                value={tab}
                                onChange={(_, value) => setTab(value)}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    px: 2,
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    minHeight: 44,
                                    '& .MuiTab-root': {
                                        minHeight: 44,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                    },
                                }}
                            >
                                <Tab label="Resumen" />
                                <Tab label="Citas" />
                                <Tab label="Consultas" />
                                <Tab label="Crecimiento" />
                            </Tabs>

                            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                                {tab === 0 && (
                                    <Stack spacing={2.5}>
                                        <SectionTitle
                                            icon={<PersonIcon fontSize="small" />}
                                            title="Datos generales"
                                            subtitle={patientEmail}
                                        />

                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                                gap: 2,
                                            }}
                                        >
                                            <InfoItem label="Nombre" value={patientName} />
                                            <InfoItem label="Correo" value={patientEmail} />
                                            <InfoItem label="Teléfono" value={patientPhone} />
                                            <InfoItem
                                                label="Fecha de nacimiento"
                                                value={patientBirthDate ? formatDate(patientBirthDate) : 'No registrada'}
                                            />
                                            <InfoItem label="Sexo" value={patientGender} />
                                            <InfoItem label="Tipo de sangre" value={patientBloodType} />
                                        </Box>

                                        <Divider />

                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 3
                                            }}
                                        >
                                            <Box sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                                    {patient.appointments?.length ?? 0}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Citas
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 1.5, textAlign: 'center', borderLeft: 1, borderColor: 'divider' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                                    {patient.consultations?.length ?? 0}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Consultas
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: 1.5, textAlign: 'center', borderLeft: 1, borderColor: 'divider' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                                    {patient.growthHistory?.length ?? 0}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Registros
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                )}

                                {tab === 1 && (
                                    <Stack spacing={2}>
                                        <SectionTitle
                                            icon={<EventIcon fontSize="small" />}
                                            title="Últimas citas"
                                            subtitle="Las 5 citas más recientes"
                                        />

                                        {!patient.appointments?.length && (
                                            <EmptyState text="Este paciente no tiene citas registradas." />
                                        )}

                                        {patient.appointments?.map((appointment) => (
                                            <Box
                                                key={appointment.id}
                                                sx={{
                                                    p: 1.5,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 3
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 800 }}>
                                                    {formatDateTime(appointment.startDateTime)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Dr. {getText(appointment.doctor, ['fullName', 'name'])}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {"Estado: " + getText(appointment, ['status'], 'Sin detalle') + "  |  Motivo: " + getText(appointment, ['reason'])}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}

                                {tab === 2 && (
                                    <Stack spacing={2}>
                                        <SectionTitle
                                            icon={<MedicalServicesIcon fontSize="small" />}
                                            title="Consultas"
                                            subtitle="Historial clínico registrado"
                                        />

                                        {!patient.consultations?.length && (
                                            <EmptyState text="Este paciente no tiene consultas registradas." />
                                        )}

                                        {patient.consultations?.map((consultation) => (
                                            <Box
                                                key={consultation.id}
                                                sx={{
                                                    p: 1.5,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 3
                                                }}
                                            >
                                                <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }} >
                                                    <Typography sx={{ fontWeight: 800 }}>
                                                        {formatDate(consultation.date)}
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        label={`Dr. ${getText(consultation.doctor, ['fullName', 'name'])}`}
                                                    />
                                                </Stack>

                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    {getText(
                                                        consultation,
                                                        ['diagnosis', 'reason', 'notes', 'treatment'],
                                                        'Sin detalle clínico',
                                                    )}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}

                                {tab === 3 && (
                                    <Stack spacing={2}>
                                        <SectionTitle
                                            icon={<MonitorWeightIcon fontSize="small" />}
                                            title="Crecimiento"
                                            subtitle="Historial ordenado por fecha"
                                        />

                                        {!patient.growthHistory?.length && (
                                            <EmptyState text="Este paciente no tiene historial de crecimiento." />
                                        )}

                                        {patient.growthHistory?.map((record) => (
                                            <Box
                                                key={record.id}
                                                sx={{
                                                    p: 1.5,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 3
                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 800 }}>
                                                    {formatDate(record.date)}
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        mt: 1,
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <InfoItem
                                                        label="Peso"
                                                        value={`${getText(record, ['weight'], '-')} kg`}
                                                    />
                                                    <InfoItem
                                                        label="Talla"
                                                        value={`${getText(record, ['height'], '-')} cm`}
                                                    />
                                                    <InfoItem
                                                        label="IMC"
                                                        value={calculateBMI(getText(record, ['weight']), getText(record, ['height']))}
                                                    />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </>
                    )}

                    {!loading && !error && !patient && (
                        <Box sx={{ p: 2 }}>
                            <EmptyState text="No se encontró información del paciente." />
                        </Box>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default DetailPatient;

export const calculateBMI = (weight: string, height: string): number | null => {
    const weightKg = Number(weight);
    const heightCm = Number(height);

    if (!weightKg || !heightCm) return null;

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    return Number(bmi.toFixed(2));
};