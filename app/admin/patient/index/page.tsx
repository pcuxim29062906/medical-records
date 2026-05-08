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
    Card,
    CardContent,
    MenuItem,
    TablePagination,
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getPatients } from '@/app/actions/patients/patients';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function PatientsListPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [gender, setGender] = useState('ALL');
    const [bloodType, setBloodType] = useState('ALL');

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const loadPatients = useCallback(async () => {
        setLoading(true);

        const result = await getPatients({
            page,
            pageSize,
            search: search || undefined,
            gender,
            bloodType,
        });

        setPatients(result.items);
        setTotal(result.total);
        setLoading(false);
    }, [page, pageSize, search, gender, bloodType]);

    useEffect(() => {
        loadPatients();
    }, [loadPatients]);

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

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(0);
    };

    const handleGenderChange = (value: string) => {
        setGender(value);
        setPage(0);
    };

    const handleBloodTypeChange = (value: string) => {
        setBloodType(value);
        setPage(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
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
                    spacing={2}
                    sx={{ mb: 3, justifyContent: "space-between", alignItems: { xs: 'stretch', md: 'center' } }}
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
                        size="small"
                    >
                        Nuevo Paciente
                    </Button>
                </Stack>

                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        sx={{ alignItems: { xs: 'stretch', md: 'center' } }}
                        spacing={2}
                    >
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }} >
                            <FilterAltIcon color="action" />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Filtros
                            </Typography>
                        </Stack>

                        <TextField
                            value={search}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            placeholder="Nombre, documento, correo o teléfono..."
                            size="small"
                            sx={{ minWidth: { md: 360 } }}
                        />

                        <TextField
                            select
                            size="small"
                            label="Género"
                            value={gender}
                            onChange={(event) => handleGenderChange(event.target.value)}
                            sx={{ minWidth: 160 }}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            <MenuItem value="Masculino">Masculino</MenuItem>
                            <MenuItem value="Femenino">Femenino</MenuItem>
                            <MenuItem value="Otro">Otro</MenuItem>
                        </TextField>

                        <TextField
                            select
                            size="small"
                            label="Grupo sanguíneo"
                            value={bloodType}
                            onChange={(event) => handleBloodTypeChange(event.target.value)}
                            sx={{ minWidth: 180 }}
                        >
                            <MenuItem value="ALL">Todos</MenuItem>
                            {bloodTypes.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Chip
                            icon={<PersonIcon />}
                            label={`${total} paciente${total === 1 ? '' : 's'}`}
                            variant="outlined"
                            color="primary"
                        />
                    </Stack>
                </Paper>

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
                                <TableCell><strong>Grupo</strong></TableCell>
                                <TableCell><strong>Contacto</strong></TableCell>
                                <TableCell align="right"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={28} />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading && patients.map((patient) => (
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

                                    <TableCell>{getAge(patient.birthDate)} años</TableCell>

                                    <TableCell>
                                        {patient.bloodType ? (
                                            <Chip size="small" label={patient.bloodType} variant="outlined" color="error" />
                                        ) : (
                                            'No registrado'
                                        )}
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

                            {!loading && patients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                        No hay pacientes con los filtros seleccionados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Stack spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
                    {loading && (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    {!loading && patients.map((patient) => (
                        <Card key={patient.id} variant="outlined">
                            <CardContent>
                                <Stack spacing={1.5}>
                                    <Stack
                                        direction="row"
                                        //justifyContent="space-between" 
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

                                    <Stack
                                        direction="row" spacing={1}
                                        sx={{ flexWrap: "wrap" }}
                                    >
                                        <Chip size="small" label={`${getAge(patient.birthDate)} años`} variant="outlined" />
                                        {patient.gender && <Chip size="small" label={patient.gender} variant="outlined" />}
                                        {patient.bloodType && (
                                            <Chip size="small" label={patient.bloodType} color="error" variant="outlined" />
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

                    {!loading && patients.length === 0 && (
                        <Box sx={{ py: 5, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No hay pacientes con los filtros seleccionados.
                            </Typography>
                        </Box>
                    )}
                </Stack>

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
