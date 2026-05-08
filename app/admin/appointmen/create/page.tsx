'use client';

import { useEffect, useState } from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPatients } from '@/app/actions/patients/patients';
import { createAppointment, getAppointments } from '@/app/actions/appointments/appointmens';
import { getDoctors } from '@/app/actions/auth/user';
import { getCurrentUser } from '@/app/actions/auth/auth';

export default function CreateAppointmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const patientId = searchParams.get('patientId');

    const [patients, setPatients] = useState<any[]>([]);
    const [patient, setPatient] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getPatients().then((data) => {
            setPatients(data.items);

            if (patientId) {
                const selectedPatient = data.items.find((item: any) => item.id === patientId);
                if (selectedPatient) {
                    setPatient(selectedPatient);
                }
            }
        });
    }, [patientId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!patient?.id) {
            setError('Selecciona un paciente.');
            setLoading(false);
            return;
        }

        const formData = new FormData(event.currentTarget);
        const start = new Date(formData.get('startDateTime') as string);
        const end = new Date(formData.get('endDateTime') as string);

        const result = await createAppointment({
            patientId: patient.id,
            startDateTime: start,
            endDateTime: end,
            reason: formData.get('reason') as string,
            doctorId: selectedDoctorId
        });

        if (result.success) {
            router.push('/admin/appointmen/index');
        } else {
            setError(result.error || 'Error inesperado');
            setLoading(false);
        }
    };

    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');
    const [currentUser, setCurrentUser] = useState<any>(null);
    // Cargamos los doctores
    const loadData = async () => {
        // 1. Cargar médicos para el filtro (asumiendo que tienes esta acción)
        const docs = await getDoctors();
        setDoctors(docs);

        let user = currentUser;
        if (!user) {
            user = await getCurrentUser();
            setCurrentUser(user);

            // Si el usuario es DOCTOR, forzamos que el selector use su ID
            if (user?.role === 'DOCTOR') {
                setSelectedDoctorId(user.id);
            }
        }

    };

    useEffect(() => {
        loadData();
    }, [selectedDoctorId]);

    // Verificamos si es médico para deshabilitar el selector
    const isDoctor = currentUser?.role === 'DOCTOR';


    return (
        <Box >
            <Paper sx={{ p: { xs: 2, sm: 3, lg: 4 }, mx: 'auto', borderRadius: 3 }}>
                <Stack spacing={0.5} sx={{ mb: 3 }}>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                        Nueva Cita
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Agenda una cita médica para un paciente registrado
                    </Typography>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                size="small"
                                value={selectedDoctorId}
                                onChange={(e) => setSelectedDoctorId(e.target.value)}
                                sx={{ minWidth: 200 }}
                                fullWidth
                                disabled={isDoctor} // El médico no puede cambiar el filtro
                                helperText={isDoctor ? "Vista restringida a su agenda personal" : ""}
                            >
                                <MenuItem value="all">Todos los Médicos</MenuItem>
                                {doctors.map(doc => (
                                    <MenuItem key={doc.id} value={doc.id}>
                                        Dr. {doc.fullName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>

                            <Autocomplete
                                options={patients}
                                value={patient}
                                disabled={Boolean(patientId)}
                                onChange={(_, value) => setPatient(value)}
                                getOptionLabel={(option) => option.fullName || ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField {...params} label="Paciente" required />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                required
                                label="Inicio"
                                name="startDateTime"
                                type="datetime-local"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                required
                                label="Fin"
                                name="endDateTime"
                                type="datetime-local"
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Motivo de la cita"
                                name="reason"
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar Cita'}
                                </Button>
                                <Button variant="outlined" onClick={() => router.back()}>
                                    Cancelar
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
