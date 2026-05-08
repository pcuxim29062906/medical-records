'use client';

import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { createUser, updateUser } from '@/app/actions/auth/user';

type UserFormProps = {
    mode: 'create' | 'edit';
    user?: any;
};

export default function UserForm({ mode, user }: UserFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState(user?.role || 'ASSISTANT');
    const [isActive, setIsActive] = useState(user?.isActive ?? true);

    const doctorProfile = user?.doctorProfile;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);

        const payload = {
            fullName: formData.get('fullName') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            role,
            isActive,
            doctorProfile:
                role === 'DOCTOR'
                    ? {
                        professionalLicense: formData.get('professionalLicense') as string,
                        specialty: formData.get('specialty') as string,
                        subspecialty: formData.get('subspecialty') as string,
                        university: formData.get('university') as string,
                        phone: formData.get('phone') as string,
                        office: formData.get('office') as string,
                    }
                    : undefined,
        };

        const result =
            mode === 'create'
                ? await createUser(payload)
                : await updateUser(user.id, payload);

        if (result.success) {
            router.push('/admin/users/index');
            router.refresh();
        } else {
            setError(result.error || 'No se pudo guardar el usuario.');
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
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
                    spacing={2}
                    sx={{ mb: 3, justifyContent: "space-between", alignItems: { xs: 'stretch', sm: 'center' } }}
                >
                    <Box>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                            {mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {mode === 'create'
                                ? 'Crea una cuenta para administradores, médicos o asistentes'
                                : 'Actualiza los datos de acceso y perfil del usuario'}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1.5}>
                        <Button variant="outlined" onClick={() => router.back()} size="small">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            form="user-form"
                            variant="contained"
                            disabled={loading}
                            size="small"
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </Stack>
                </Stack>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form id="user-form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, lg: 7 }}>
                            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
                                <Divider sx={{ mb: 3 }}>Datos de Acceso</Divider>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 7 }}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Nombre completo"
                                            name="fullName"
                                            defaultValue={user?.fullName || ''}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 5 }}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Correo electrónico"
                                            name="email"
                                            type="email"
                                            defaultValue={user?.email || ''}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            required={mode === 'create'}
                                            label={mode === 'create' ? 'Contraseña' : 'Nueva contraseña'}
                                            name="password"
                                            type="password"
                                            helperText={
                                                mode === 'edit'
                                                    ? 'Déjalo vacío para conservar la contraseña actual.'
                                                    : ''
                                            }
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Rol"
                                            value={role}
                                            onChange={(event) => setRole(event.target.value)}
                                        >
                                            <MenuItem value="ADMIN">Administrador</MenuItem>
                                            <MenuItem value="DOCTOR">Doctor</MenuItem>
                                            <MenuItem value="ASSISTANT">Asistente</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isActive}
                                                    onChange={(event) => setIsActive(event.target.checked)}
                                                />
                                            }
                                            label="Usuario activo"
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12, lg: 5 }}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: { xs: 2, sm: 3 },
                                    height: '100%',
                                    opacity: role === 'DOCTOR' ? 1 : 0.65,
                                }}
                            >
                                <Divider sx={{ mb: 3 }}>Perfil Médico</Divider>

                                {role === 'DOCTOR' ? (
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Cédula profesional"
                                            name="professionalLicense"
                                            defaultValue={doctorProfile?.professionalLicense || ''}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Especialidad"
                                            name="specialty"
                                            defaultValue={doctorProfile?.specialty || ''}
                                            placeholder="Ej. Medicina Interna"
                                        />

                                        <TextField
                                            fullWidth
                                            label="Subespecialidad"
                                            name="subspecialty"
                                            defaultValue={doctorProfile?.subspecialty || ''}
                                            placeholder="Ej. Cardiología"
                                        />

                                        <TextField
                                            fullWidth
                                            label="Universidad"
                                            name="university"
                                            defaultValue={doctorProfile?.university || ''}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Teléfono profesional"
                                            name="phone"
                                            defaultValue={doctorProfile?.phone || ''}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Consultorio"
                                            name="office"
                                            defaultValue={doctorProfile?.office || ''}
                                        />
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Estos campos sólo aplican cuando el rol del usuario es Doctor.
                                    </Typography>
                                )}
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
                                {loading ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
