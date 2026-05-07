'use client';

import { use, useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid as Grid, Divider, Alert, Autocomplete, Chip, IconButton, ListItem, ListItemText, List, Stack } from '@mui/material';
import { createConsultation } from '@/app/actions/consultations/consultations';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAvailableStudies } from '@/app/actions/studies/studies';
import { AddCircle, Delete } from '@mui/icons-material';

export default function NewConsultationPage({ params }: { params: Promise<{ id: string }> }) {

    const { id: patientId } = use(params);

    const [availableStudies, setAvailableStudies] = useState<any[]>([]);
    const [selectedStudies, setSelectedStudies] = useState<any[]>([]);

    const router = useRouter();
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('appointmentId')

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prescription, setPrescription] = useState<PrescriptionItem[]>([]);

    // Estados temporales para los inputs del medicamento actual
    const [tempMed, setTempMed] = useState({ name: '', dose: '', frequency: '', duration: '' });
    // Agregar medicina
    const addMedicine = () => {
        if (tempMed.name && tempMed.dose) {
            setPrescription([...prescription, tempMed]);
            setTempMed({ name: '', dose: '', frequency: '', duration: '' }); // Reset
        }
    };
    // remover medicona de receta
    const removeMedicine = (index: number) => {
        setPrescription(prescription.filter((_, i) => i !== index));
    };
    //

    useEffect(() => {
        getAvailableStudies().then(setAvailableStudies);
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);

        const studiesText = selectedStudies.map(s => `- ${s.name} (${s.category})`).join('\n');

        // Convertimos el ARRAY en un JSON string para guardarlo en el campo TEXT
        const prescriptionJsonString = JSON.stringify(prescription);

        const result = await createConsultation({
            patientId,
            weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
            height: formData.get('height') ? Number(formData.get('height')) : undefined,
            temperature: formData.get('temperature') ? Number(formData.get('temperature')) : undefined,
            glucose: formData.get('glucose') ? Number(formData.get('glucose')) : undefined,
            bloodPressure: formData.get('bloodPressure') as string,
            interrogation: formData.get('interrogation') as string, // El "motivo/subjetivo"
            physicalExam: formData.get('physicalExam') as string,
            diagnosis: formData.get('diagnosis') as string,
            medicalPrescription: prescriptionJsonString,
            studyOrders: studiesText,
            appointmentId: appointmentId || undefined,
        });

        if (result.success) {
            router.push(`/admin/patient/${patientId}`);
        } else {
            setError(result.error || "Error inesperado");
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 3, lg: 4 },
                    borderRadius: 3,
                    mx: 'auto',
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    //justifyContent="space-between"
                    //alignItems={{ xs: 'stretch', sm: 'center' }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            Nueva Consulta Médica
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Captura clínica, receta y estudios solicitados
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5}>
                        <Button
                            variant="outlined"
                            onClick={() => router.back()}
                            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start', md: 'center' } }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            form="consultation-form"
                            disabled={loading}
                            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start', md: 'center' } }}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </Stack>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {appointmentId && (
                    <Alert severity="info" sx={{ mb: 3 }} variant="filled" >
                        Esta consulta está vinculada a una cita agendada.
                    </Alert>
                )}

                <form id="consultation-form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Divider>Signos Vitales</Divider>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <TextField fullWidth label="Peso (kg)" name="weight" type="number" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <TextField fullWidth label="Talla (cm)" name="height" type="number" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <TextField fullWidth label="Temp (°C)" name="temperature" type="number" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <TextField fullWidth label="Presión" name="bloodPressure" placeholder="120/80" />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <TextField fullWidth label="Glucosa" name="glucose" type="number" />
                        </Grid>

                        <Grid size={{ xs: 12, lg: 7 }}>
                            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                                <Divider sx={{ mb: 3 }}>Exploración Clínica</Divider>

                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Interrogatorio (Subjetivo)"
                                        name="interrogation"
                                        required
                                        multiline
                                        rows={4}
                                        placeholder="Lo que el paciente manifiesta..."
                                    />

                                    <TextField
                                        fullWidth
                                        label="Examen Físico (Objetivo)"
                                        name="physicalExam"
                                        multiline
                                        rows={4}
                                        placeholder="Hallazgos de la exploración..."
                                    />

                                    <TextField
                                        fullWidth
                                        label="Diagnóstico"
                                        name="diagnosis"
                                        required
                                        multiline
                                        rows={3}
                                    />
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 5 }}>
                            <Stack spacing={3}>
                                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                                    <Divider sx={{ mb: 3 }}>Receta Médica</Divider>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Medicamento"
                                                value={tempMed.name}
                                                onChange={(e) => setTempMed({ ...tempMed, name: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Dosis"
                                                value={tempMed.dose}
                                                onChange={(e) => setTempMed({ ...tempMed, dose: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 5 }}>
                                            <TextField
                                                fullWidth
                                                label="Frecuencia"
                                                value={tempMed.frequency}
                                                onChange={(e) => setTempMed({ ...tempMed, frequency: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 9, sm: 5 }}>
                                            <TextField
                                                fullWidth
                                                label="Duración"
                                                value={tempMed.duration}
                                                onChange={(e) => setTempMed({ ...tempMed, duration: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 3, sm: 2 }} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton color="primary" onClick={addMedicine} type="button">
                                                <AddCircle fontSize="large" />
                                            </IconButton>
                                        </Grid>
                                    </Grid>

                                    <List dense sx={{ mt: 2 }}>
                                        {prescription.map((item, index) => (
                                            <ListItem
                                                key={index}
                                                divider
                                                secondaryAction={
                                                    <IconButton edge="end" onClick={() => removeMedicine(index)} type="button">
                                                        <Delete color="error" />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText
                                                    primary={<strong>{item.name} - {item.dose}</strong>}
                                                    secondary={`${item.frequency || 'Sin frecuencia'} | ${item.duration || 'Sin duración'}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>

                                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                                    <Divider sx={{ mb: 3 }}>Estudios Sugeridos</Divider>

                                    <Autocomplete
                                        multiple
                                        options={availableStudies}
                                        value={selectedStudies}
                                        getOptionLabel={(option: any) => option.name}
                                        groupBy={(option: any) => option.category}
                                        onChange={(_, newValue) => setSelectedStudies(newValue)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Estudios" placeholder="Buscar estudio..." />
                                        )}
                                    />
                                </Paper>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ display: { xs: 'flex', sm: 'none' }, gap: 2 }}>
                            <Button fullWidth variant="outlined" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button fullWidth variant="contained" type="submit" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );

}