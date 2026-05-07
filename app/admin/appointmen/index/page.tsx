'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import Link from 'next/link';
import {
    getAppointments,
    updateAppointmentStatus,
} from '@/app/actions/appointments/appointmens';
import { CalendarMonth } from '@mui/icons-material';
import { getCurrentUser } from '@/app/actions/auth/auth'; // Asegúrate de que la ruta sea correcta
import { load } from 'next/dist/compiled/@edge-runtime/primitives/load';

const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
};

const statusColors: Record<string, any> = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    COMPLETED: 'success',
    CANCELLED: 'default',
};

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    const loadData = useCallback(async () => {
        // 1. Obtener el usuario actual
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // 2. Cargar citas filtradas si es DOCTOR
        const doctorIdFilter = currentUser?.role === 'DOCTOR' ? currentUser.id : undefined;
        const data = await getAppointments(doctorIdFilter);
        setAppointments(data);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    //const loadAppointments = () => {
    //    getAppointments().then(setAppointments);
    //};

    //useEffect(() => {
    //    loadAppointments();
    //}, []);

    const handleStatusChange = async (id: string, status: string) => {
        await updateAppointmentStatus(id, status);
        //loadAppointments();
        loadData()
    };

    return (
        <Box >
            <Paper sx={{ p: { xs: 2, sm: 3 }, mx: 'auto', borderRadius: 3 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    //justifyContent="space-between"
                    //alignItems={{ xs: 'stretch', md: 'center' }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >

                    <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            {user?.role === 'DOCTOR' ? 'Mis Citas Médicas' : 'Citas Médicas Globales'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.role === 'DOCTOR'
                                ? `Agenda personal de ${user.fullName}`
                                : 'Gestión general de la clínica'}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        href="/admin/appointmen/create"
                        sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start', md: 'center' } }}
                    >
                        Nueva Cita
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CalendarMonth />}
                        component={Link}
                        href="/admin/appointmen/calendar"
                        sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start', md: 'center' } }}
                    >
                        Calendario
                    </Button>
                </Stack>

                <TableContainer>
                    <Table size="small" >
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell><strong>Paciente</strong></TableCell>
                                <TableCell><strong>Fecha</strong></TableCell>
                                <TableCell><strong>Horario</strong></TableCell>
                                <TableCell><strong>Motivo</strong></TableCell>
                                <TableCell><strong>Estado</strong></TableCell>
                                <TableCell align="right"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow key={appointment.id} hover>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {appointment.patient?.fullName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {appointment.patient?.documentId}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        {new Date(appointment.startDateTime).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell>
                                        {new Date(appointment.startDateTime).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                        {' - '}
                                        {new Date(appointment.endDateTime).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </TableCell>

                                    <TableCell>{appointment.reason || 'Sin motivo registrado'}</TableCell>

                                    <TableCell>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }} >
                                            <Chip
                                                size="small"
                                                label={statusLabels[appointment.status] || appointment.status}
                                                color={statusColors[appointment.status] || 'default'}
                                            />

                                            <TextField
                                                select
                                                size="small"
                                                value={appointment.status}
                                                onChange={(event) => handleStatusChange(appointment.id, event.target.value)}
                                            >
                                                <MenuItem value="PENDING">Pendiente</MenuItem>
                                                <MenuItem value="CONFIRMED">Confirmada</MenuItem>
                                                <MenuItem value="COMPLETED">Completada</MenuItem>
                                                <MenuItem value="CANCELLED">Cancelada</MenuItem>
                                            </TextField>
                                        </Stack>
                                    </TableCell>

                                    <TableCell align="right">
                                        <IconButton
                                            color="success"
                                            component={Link}
                                            href={`/admin/consultation/patient/${appointment.patientId}/create?appointmentId=${appointment.id}`}
                                            disabled={appointment.status === 'CANCELLED'}
                                        >
                                            <MedicalServicesIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {appointments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                        No hay citas registradas.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
