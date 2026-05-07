'use client';

import { useCallback, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Box, Paper, Typography, useTheme, Chip, Stack, TextField, MenuItem } from '@mui/material';
import { getAppointments } from '@/app/actions/appointments/appointmens';
import { useRouter } from 'next/navigation';
import AppointmentQuickDialog from '@/components/appointmant/AppointmentQuickDialog';
import { getDoctors } from '@/app/actions/auth/user';
import { getCurrentUser } from '@/app/actions/auth/auth';

export default function AppointmentsCalendar() {
    const [events, setEvents] = useState<any[]>([]);
    const theme = useTheme();
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectionInfo, setSelectionInfo] = useState<any>(null);
    const [doctors, setDoctors] = useState<any[]>([]);

    // Estado para controlar el usuario actual y su rol
    const [currentUser, setCurrentUser] = useState<any>(null);

    const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');

    // Cargamos los doctores
    const loadData = useCallback(async () => {
        // 1. Obtener el usuario actual si no lo tenemos
        let user = currentUser;
        if (!user) {
            user = await getCurrentUser();
            setCurrentUser(user);

            // Si el usuario es DOCTOR, forzamos que el selector use su ID
            if (user?.role === 'DOCTOR') {
                setSelectedDoctorId(user.id);
            }
        }

        // 2. Cargar lista de médicos (Solo si es ADMIN/Recepcionista, opcional)
        const docs = await getDoctors();
        setDoctors(docs);

        // 3. Determinar qué filtro usar
        // Si es doctor, ignoramos 'all' y usamos su ID
        const finalDoctorId = user?.role === 'DOCTOR' ? user.id : (selectedDoctorId === 'all' ? undefined : selectedDoctorId);

        // 4. Cargar citas
        const appts = await getAppointments(finalDoctorId);

        const formatted = appts.map(appt => ({
            id: appt.id,
            title: `${appt.patient?.fullName || 'S/N'} (Dr. ${appt.doctor?.fullName || 'N/A'})`,
            start: appt.startDateTime,
            end: appt.endDateTime,
            backgroundColor: getStatusColor(appt.status),
            borderColor: getStatusColor(appt.status),
            extendedProps: {
                status: appt.status,
                patientId: appt.patientId,
                reason: appt.reason
            }
        }));
        setEvents(formatted);
    }, [selectedDoctorId, currentUser]);

    useEffect(() => {
        loadData();
    }, [loadData]); // Se recarga cada vez que cambia el filtro

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return theme.palette.warning.main;
            case 'CONFIRMED': return theme.palette.info.main;
            case 'COMPLETED': return theme.palette.success.main;
            case 'CANCELLED': return theme.palette.error.light;
            default: return theme.palette.primary.main;
        }
    };

    const handleEventClick = (info: any) => {
        // Al hacer clic, enviamos al doctor a la consulta o a ver el detalle
        const { patientId, id } = info.event.id;
        router.push(`/admin/consultation/patient/${info.event.extendedProps.patientId}/create?appointmentId=${info.event.id}`);
    };

    const handleSelect = (info: any) => {
        setSelectionInfo({
            start: info.start,
            end: info.end
        });
        setIsModalOpen(true)
    }

    // Verificamos si es médico para deshabilitar el selector
    const isDoctor = currentUser?.role === 'DOCTOR';

    return (
        <Box sx={{ p: 3 }}>

            <Paper sx={{ p: 3, mb: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Filtrar por Médico:
                    </Typography>
                    <TextField
                        select
                        size="small"
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        disabled={isDoctor} // El médico no puede cambiar el filtro
                        sx={{ minWidth: 250 }}
                        helperText={isDoctor ? "Vista restringida a su agenda personal" : ""}
                    >
                        {!isDoctor && <MenuItem value="all">Todos los Médicos</MenuItem>}
                        {doctors.map(doc => (
                            <MenuItem key={doc.id} value={doc.id}>
                                Dr. {doc.fullName}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
                    {isDoctor ? `Agenda: Dr. ${currentUser?.fullName}` : 'Agenda Interactiva Global'}
                </Typography>

                <Box sx={{
                    '& .fc': { fontFamily: theme.typography.fontFamily },
                    '& .fc-event': { cursor: 'pointer', borderRadius: '4px', p: 0.5 }
                }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek" // Vista semanal por defecto para ver traslapes
                        selectable={true} // PERMITE SELECCIONAR RANGOS
                        selectMirror={true} // MUESTRA UN RECUADRO MIENTRAS ARRASTRAS
                        selectOverlap={false} // BLOQUEA TRASLAPES DESDE LA UI
                        select={handleSelect}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        locale={esLocale}
                        events={events}
                        eventClick={handleEventClick}
                        slotMinTime="07:00:00" // Hora de inicio jornada
                        slotMaxTime="21:00:00" // Hora fin jornada
                        allDaySlot={false}
                        height="70vh"
                        editable={true} // Permitiría drag & drop si implementas el update de fechas
                        nowIndicator={true}
                        eventContent={(eventInfo) => (
                            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                                    {eventInfo.timeText}
                                </Typography>
                                <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
                                    {eventInfo.event.title}
                                </Typography>
                            </Box>
                        )}
                    />
                </Box>

                {/* Leyenda de colores */}
                <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
                    <Chip label="Pendiente" size="small" sx={{ bgcolor: theme.palette.warning.main, color: 'white' }} />
                    <Chip label="Confirmada" size="small" sx={{ bgcolor: theme.palette.info.main, color: 'white' }} />
                    <Chip label="Completada" size="small" sx={{ bgcolor: theme.palette.success.main, color: 'white' }} />
                </Stack>
            </Paper>

            <AppointmentQuickDialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectionInfo={selectionInfo}
                onSave={loadData}
                doctors={doctors}
                id_doctor={selectedDoctorId}
            />
        </Box>
    );
}