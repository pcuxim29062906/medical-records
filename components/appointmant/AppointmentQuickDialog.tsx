'use client';
import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Stack, Autocomplete, Typography
} from '@mui/material';
import { createAppointment } from '@/app/actions/appointments/appointmens';
import { getPatients } from '@/app/actions/patients/patients';

export default function AppointmentQuickDialog({ open, onClose, selectionInfo, onSave, doctors, id_doctor }: any) {
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    // Nuevo estado para el médico seleccionado
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    // Sincronizar el médico seleccionado con el filtro del calendario al abrir
    useEffect(() => {
        if (open) {
            getPatients().then(setPatients);
            
            // Si id_doctor es un objeto médico completo, lo usamos. 
            // Si es solo un ID, buscamos el objeto en la lista 'doctors'
            const defaultDoc = doctors.find((d: any) => d.id === id_doctor) || null;
            setSelectedDoctor(defaultDoc);
        }
    }, [open, id_doctor, doctors]);

    const handleSave = async () => {
        // Validamos que haya paciente y médico seleccionado
        if (!selectedPatient || !selectionInfo || !selectedDoctor) {
            alert("Por favor selecciona un paciente y un médico.");
            return;
        }

        setLoading(true);
        const res = await createAppointment({
            patientId: selectedPatient.id,
            startDateTime: selectionInfo.start,
            endDateTime: selectionInfo.end,
            reason: reason,
            doctorId: selectedDoctor.id // Ahora enviamos el ID real
        });

        if (res.success) {
            onSave();
            onClose();
            setReason('');
            setSelectedPatient(null);
        } else {
            alert(res.error);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 'bold' }}>Agendar Nueva Cita</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Horario: **{selectionInfo?.start.toLocaleString()}**
                    </Typography>

                    {/* Autocomplete de Médicos */}
                    <Autocomplete
                        options={doctors}
                        getOptionLabel={(option: any) => `Dr. ${option.fullName || option.name}`}
                        value={selectedDoctor}
                        onChange={(_, newValue) => setSelectedDoctor(newValue)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} label="Asignar Médico" variant="outlined" required />
                        )}
                    />

                    {/* Autocomplete de Pacientes */}
                    <Autocomplete
                        options={patients}
                        getOptionLabel={(option) => `${option.fullName} (${option.documentId})`}
                        value={selectedPatient}
                        onChange={(_, newValue) => setSelectedPatient(newValue)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} label="Buscar Paciente" variant="outlined" fullWidth />
                        )}
                    />

                    <TextField
                        label="Motivo de la consulta"
                        multiline
                        rows={3}
                        fullWidth
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ej: Control de diabetes..."
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!selectedPatient || !selectedDoctor || loading}
                >
                    {loading ? 'Agendando...' : 'Confirmar Cita'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}