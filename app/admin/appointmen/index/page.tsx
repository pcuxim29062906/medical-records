'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { CalendarMonth } from '@mui/icons-material';
import Link from 'next/link';
import {
    getAppointments,
    updateAppointmentStatus,
} from '@/app/actions/appointments/appointmens';
import { getCurrentUser } from '@/app/actions/auth/auth';
import {
    getDoctors
} from '@/app/actions/auth/user';

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
    const [doctors, setDoctors] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [status, setStatus] = useState('ALL');
    const [doctorId, setDoctorId] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const loadData = useCallback(async () => {
        setLoading(true);

        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const effectiveDoctorId =
            currentUser?.role === 'DOCTOR'
                ? currentUser.id
                : doctorId !== 'ALL'
                    ? doctorId
                    : undefined;

        const [appointmentsResult, doctorsResult] = await Promise.all([
            getAppointments({
                page,
                pageSize,
                doctorId: effectiveDoctorId,
                status,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            }),
            currentUser?.role === 'DOCTOR' ? Promise.resolve([]) : getDoctors(),
        ]);

        setAppointments(appointmentsResult.items);
        setTotal(appointmentsResult.total);
        setDoctors(doctorsResult);
        setLoading(false);
    }, [page, pageSize, status, doctorId, startDate, endDate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        await updateAppointmentStatus(id, newStatus);
        loadData();
    };

    const handleStatusFilter = (value: string) => {
        setStatus(value);
        setPage(0);
    };

    const handleDoctorFilter = (value: string) => {
        setDoctorId(value);
        setPage(0);
    };

    const handleStartDateFilter = (value: string) => {
        setStartDate(value);
        setPage(0);
    };

    const handleEndDateFilter = (value: string) => {
        setEndDate(value);
        setPage(0);
    };

    return (
        <Box>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mx: 'auto', borderRadius: 3 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{ mb: 3, justifyContent: "space-between", alignItems: { xs: 'stretch', md: 'center' } }}
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

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            component={Link}
                            href="/admin/appointmen/create"
                            size="small"
                        >
                            Nueva Cita
                        </Button>

                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<CalendarMonth />}
                            component={Link}
                            href="/admin/appointmen/calendar"
                            size="small"
                        >
                            Calendario
                        </Button>
                    </Stack>
                </Stack>

                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        sx={{ alignItems: { xs: 'stretch', md: 'center' } }}
                    >
                        <Stack direction="row" spacing={1}>
                            <FilterAltIcon color="action" />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Filtros
                            </Typography>
                        </Stack>

                        <TextField
                            select
                            size="small"
                            label="Estado"
                            value={status}
                            onChange={(event) => handleStatusFilter(event.target.value)}
                            sx={{ minWidth: 180 }}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="PENDING">Pendiente</MenuItem>
                            <MenuItem value="CONFIRMED">Confirmada</MenuItem>
                            <MenuItem value="COMPLETED">Completada</MenuItem>
                            <MenuItem value="CANCELLED">Cancelada</MenuItem>
                        </TextField>

                        {user?.role !== 'DOCTOR' && (
                            <TextField
                                select
                                size="small"
                                label="Médico"
                                value={doctorId}
                                onChange={(event) => handleDoctorFilter(event.target.value)}
                                sx={{ minWidth: 240 }}
                            >
                                <MenuItem value="ALL">Todos los médicos</MenuItem>
                                {doctors.map((doctor) => (
                                    <MenuItem key={doctor.id} value={doctor.id}>
                                        {doctor.fullName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        <TextField
                            size="small"
                            label="Desde"
                            type="date"
                            value={startDate}
                            onChange={(event) => handleStartDateFilter(event.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />

                        <TextField
                            size="small"
                            label="Hasta"
                            type="date"
                            value={endDate}
                            onChange={(event) => handleEndDateFilter(event.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Stack>
                </Paper>

                <TableContainer>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell><strong>Paciente</strong></TableCell>
                                <TableCell><strong>Fecha</strong></TableCell>
                                <TableCell><strong>Horario</strong></TableCell>
                                <TableCell><strong>Motivo</strong></TableCell>
                                <TableCell><strong>Estado</strong></TableCell>
                                <TableCell><strong>Doctor</strong></TableCell>
                                <TableCell align="right"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={28} />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading && appointments.map((appointment) => (
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

                                    <TableCell>
                                        {appointment.reason || 'Sin motivo registrado'}
                                    </TableCell>

                                    <TableCell>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
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

                                    <TableCell>
                                        {appointment.doctor?.fullName || 'Sin médico asignado'}
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

                            {!loading && appointments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                        No hay citas con los filtros seleccionados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={pageSize}
                    onRowsPerPageChange={(event) => {
                        setPageSize(Number(event.target.value));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                />
            </Paper>
        </Box>
    );
}
