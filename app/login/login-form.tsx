'use client';

import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
    InputAdornment,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/actions/auth/auth';

export default function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);

        const result = await loginUser({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        });

        if (result.success) {
            router.push('/admin');
            router.refresh();
        } else {
            setError(result.error || 'No se pudo iniciar sesión.');
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                bgcolor: 'grey.100',
            }}
        >
            <Box
                sx={{
                    display: { xs: 'none', md: 'block' },
                    position: 'relative',
                    backgroundImage: `
            linear-gradient(90deg, rgba(7, 34, 59, 0.72), rgba(7, 34, 59, 0.25)),
            url('/images/login-clinic-hero.png')
          `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Stack
                    spacing={2}
                    sx={{
                        position: 'absolute',
                        left: 56,
                        right: 56,
                        bottom: 56,
                        color: 'common.white',
                    }}
                >
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'rgba(255,255,255,0.16)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <LocalHospitalIcon fontSize="large" />
                    </Box>

                    <Typography variant="h3" sx={{ fontWeight: 800, maxWidth: 520 }}>
                        Gestión clínica simple y segura
                    </Typography>

                    <Typography variant="body1" sx={{ maxWidth: 520, opacity: 0.9 }}>
                        Administra pacientes, citas, consultas, recetas y estudios desde un solo expediente médico.
                    </Typography>
                </Stack>
            </Box>

            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'grid',
                    placeItems: 'center',
                    px: { xs: 2, sm: 4 },
                    py: 4,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        maxWidth: 440,
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Stack spacing={0.75} sx={{ mb: 3 }}>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
                            Bienvenido
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ingresa tus credenciales para acceder al sistema clínico.
                        </Typography>
                    </Stack>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                fullWidth
                                required
                                label="Correo electrónico"
                                name="email"
                                type="email"
                                autoComplete="email"
                            //InputProps={{
                            //  startAdornment: (
                            //    <InputAdornment position="start">
                            //      <EmailIcon color="action" />
                            //    </InputAdornment>
                            //  ),
                            //}}
                            />

                            <TextField
                                fullWidth
                                required
                                label="Contraseña"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                            //InputProps={{
                            //  startAdornment: (
                            //    <InputAdornment position="start">
                            //      <LockIcon color="action" />
                            //    </InputAdornment>
                            //  ),
                            //}}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ py: 1.4, fontWeight: 700 }}
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Box>
        </Box>
    );
}
