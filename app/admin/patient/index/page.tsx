'use client';

import {
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    IconButton,
    TextField,
    Stack,
    Chip,
    InputAdornment,
    Card,
    CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { getPatients } from '@/app/actions/patients/patients';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Patient } from '@/app/generated/prisma/browser';

export default function PatientsListPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getPatients()
            .then((data) => setPatients(data))
            .finally(() => setLoading(false));
    }, []);

    const getAge = (birthDate: Date | string) => {
        const birth = new Date(birthDate);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    const filteredPatients = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) return patients;

        return patients.filter((patient: any) => {
            return [
                patient.fullName,
                patient.documentId,
                patient.email,
                patient.phone,
            ]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(value));
        });
    }, [patients, search]);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    mx: 'auto',
                }}
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    //justifyContent="space-between"
                    //alignItems={{ xs: 'stretch', md: 'center' }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            Expedientes Médicos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Consulta y administra los pacientes registrados
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        href="/admin/patient/create"
                        sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start', md: 'center' } }}
                    >
                        Nuevo Paciente
                    </Button>
                </Stack>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    //justifyContent="space-between"
                    //alignItems={{ xs: 'stretch', md: 'center' }}
                    sx={{ mb: 3 }}
                >
                    <TextField
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por nombre, documento, correo o teléfono..."
                        size="small"
                        sx={{ maxWidth: { md: 520 } }}
                        //InputProps={{
                        //    startAdornment: (
                        //        <InputAdornment position="start">
                        //            <SearchIcon color="action" />
                        //        </InputAdornment>
                        //    ),
                        //}}
                    />

                    <Chip
                        icon={<PersonIcon />}
                        label={`${filteredPatients.length} paciente${filteredPatients.length === 1 ? '' : 's'}`}
                        variant="outlined"
                        color="primary"
                    />
                </Stack>

                {loading ? (
                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                        Cargando pacientes...
                    </Typography>
                ) : filteredPatients.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            No se encontraron pacientes
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Intenta con otra búsqueda o registra un nuevo paciente.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Desktop / tablet */}
                        <TableContainer
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Table size="small">
                                <TableHead sx={{ bgcolor: 'grey.100' }}>
                                    <TableRow>
                                        <TableCell><strong>Paciente</strong></TableCell>
                                        <TableCell><strong>ID / Documento</strong></TableCell>
                                        <TableCell><strong>Edad</strong></TableCell>
                                        <TableCell><strong>Contacto</strong></TableCell>
                                        <TableCell align="right"><strong>Acciones</strong></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filteredPatients.map((patient: any) => (
                                        <TableRow key={patient.id} hover>
                                            <TableCell>
                                                <Typography sx={{ fontWeight: 700 }}>
                                                    {patient.fullName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {patient.gender || 'Sin género registrado'}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>{patient.documentId}</TableCell>

                                            <TableCell>
                                                {getAge(patient.birthDate)} años
                                            </TableCell>

                                            <TableCell>
                                                <Typography variant="body2">
                                                    {patient.phone || 'Sin teléfono'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {patient.email || 'Sin correo'}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="right">
                                                <IconButton
                                                    color="info"
                                                    component={Link}
                                                    href={`/admin/patient/${patient.id}`}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Mobile */}
                        <Stack spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
                            {filteredPatients.map((patient: any) => (
                                <Card key={patient.id} variant="outlined">
                                    <CardContent>
                                        <Stack spacing={1.5}>
                                            <Stack
                                                direction="row"
                                                //justifyContent="space-between"
                                                //alignItems="flex-start"
                                                spacing={2}
                                            >
                                                <Box>
                                                    <Typography sx={{ fontWeight: 700 }}>
                                                        {patient.fullName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {patient.documentId}
                                                    </Typography>
                                                </Box>

                                                <IconButton
                                                    color="info"
                                                    component={Link}
                                                    href={`/admin/patient/${patient.id}`}
                                                    size="small"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Stack>

                                            <Stack direction="row" spacing={1}>
                                                <Chip
                                                    size="small"
                                                    label={`${getAge(patient.birthDate)} años`}
                                                    variant="outlined"
                                                />
                                                {patient.gender && (
                                                    <Chip
                                                        size="small"
                                                        label={patient.gender}
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Stack>

                                            <Box>
                                                <Typography variant="body2">
                                                    {patient.phone || 'Sin teléfono'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {patient.email || 'Sin correo'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    </>
                )}
            </Paper>
        </Box>
    );
}
