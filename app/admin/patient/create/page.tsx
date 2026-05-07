'use client';

import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { createPatient } from '@/app/actions/patients/patients';
import { useRouter } from 'next/navigation';

export default function Create() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);

        const result = await createPatient({
            fullName: formData.get('fullName') as string,
            documentId: formData.get('documentId') as string,
            birthDate: new Date(formData.get('birthDate') as string),
            gender: formData.get('gender') as string,
            bloodType: formData.get('bloodType') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            allergies: formData.get('allergies') as string,
            chronicDiseases: formData.get('chronicDiseases') as string,
        });

        if (result.success) {
            router.push('/admin/patient/index');
        } else {
            setError(result.error || 'Error desconocido');
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
                    //maxWidth: 1200,
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
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                            Registro de Nuevo Paciente
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Datos generales, contacto e información médica inicial
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5}>
                        <Button variant="outlined" onClick={() => router.back()}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            form="patient-form"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Registrar'}
                        </Button>
                    </Stack>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form id="patient-form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, lg: 7 }}>
                            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                                <Divider sx={{ mb: 3 }}>Datos Personales</Divider>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <TextField
                                            fullWidth
                                            label="Nombre completo"
                                            name="fullName"
                                            required
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Documento de identidad"
                                            name="documentId"
                                            required
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Fecha de nacimiento"
                                            name="birthDate"
                                            type="date"
                                            required
                                        //InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField fullWidth select label="Género" name="gender" defaultValue="M">
                                            <MenuItem value="M">Masculino</MenuItem>
                                            <MenuItem value="F">Femenino</MenuItem>
                                            <MenuItem value="O">Otro</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Grupo sanguíneo"
                                            name="bloodType"
                                            defaultValue=""
                                        >
                                            <MenuItem value="">No especificado</MenuItem>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((op) => (
                                                <MenuItem key={op} value={op}>
                                                    {op}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 5 }}>
                            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                                <Divider sx={{ mb: 3 }}>Contacto</Divider>

                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Correo electrónico"
                                        name="email"
                                        type="email"
                                        placeholder="paciente@correo.com"
                                    />

                                    <TextField
                                        fullWidth
                                        label="Teléfono"
                                        name="phone"
                                        type="tel"
                                        placeholder="999 123 4567"
                                    />
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                                <Divider sx={{ mb: 3 }}>Información Médica</Divider>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Alergias conocidas"
                                            name="allergies"
                                            multiline
                                            rows={4}
                                            placeholder="Medicamentos, alimentos u otras alergias..."
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Antecedentes / enfermedades crónicas"
                                            name="chronicDiseases"
                                            multiline
                                            rows={4}
                                            placeholder="Diabetes, hipertensión, asma, cirugías previas..."
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid
                            size={{ xs: 12 }}
                            sx={{
                                display: { xs: 'flex', sm: 'none' },
                                gap: 2,
                            }}
                        >
                            <Button fullWidth variant="outlined" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button fullWidth type="submit" variant="contained" disabled={loading}>
                                {loading ? 'Guardando...' : 'Registrar'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
