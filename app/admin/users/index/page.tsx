'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    Switch,
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
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import { getUsers, toggleUserActive } from '@/app/actions/auth/user';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [role, setRole] = useState('ALL');
    const [isActive, setIsActive] = useState('ALL');

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const loadUsers = useCallback(async () => {
        setLoading(true);

        const result = await getUsers({
            page,
            pageSize,
            search: search || undefined,
            role,
            isActive,
        });

        setUsers(result.items);
        setTotal(result.total);
        setLoading(false);
    }, [page, pageSize, search, role, isActive]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleActiveChange = async (id: string, checked: boolean) => {
        await toggleUserActive(id, checked);
        loadUsers();
    };

    return (
        <Box>
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{ mb: 3, justifyContent: "space-between", alignItems: { xs: 'stretch', md: 'center' } }}
                >
                    <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            Usuarios
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Administra accesos, médicos y asistentes
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        component={Link}
                        href="/admin/users/create"
                        size="small"
                    >
                        Nuevo Usuario
                    </Button>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Buscar por nombre o correo..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        sx={{ minWidth: { md: 320 } }}
                    />

                    <TextField
                        select
                        size="small"
                        label="Rol"
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            setPage(0);
                        }}
                        sx={{ minWidth: 180 }}
                    >
                        <MenuItem value="ALL">Todos</MenuItem>
                        <MenuItem value="ADMIN">Administrador</MenuItem>
                        <MenuItem value="DOCTOR">Doctor</MenuItem>
                        <MenuItem value="ASSISTANT">Asistente</MenuItem>
                    </TextField>

                    <TextField
                        select
                        size="small"
                        label="Estado"
                        value={isActive}
                        onChange={(e) => {
                            setIsActive(e.target.value);
                            setPage(0);
                        }}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value="ALL">Todos</MenuItem>
                        <MenuItem value="true">Activos</MenuItem>
                        <MenuItem value="false">Inactivos</MenuItem>
                    </TextField>

                    <Chip label={`${total} usuario${total === 1 ? '' : 's'}`} color="primary" variant="outlined" />
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell><strong>Usuario</strong></TableCell>
                                <TableCell><strong>Rol</strong></TableCell>
                                <TableCell><strong>Especialidad</strong></TableCell>
                                <TableCell><strong>Activo</strong></TableCell>
                                <TableCell align="right"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <CircularProgress size={28} />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading && users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {user.fullName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {user.email}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <Chip size="small" label={user.role} variant="outlined" />
                                    </TableCell>

                                    <TableCell>
                                        {user.doctorProfile?.specialty || '--'}
                                    </TableCell>

                                    <TableCell>
                                        <Switch
                                            checked={user.isActive}
                                            onChange={(e) => handleActiveChange(user.id, e.target.checked)}
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <IconButton
                                            color="primary"
                                            component={Link}
                                            href={`/admin/users/${user.id}/edit`}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {!loading && users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                        No hay usuarios con los filtros seleccionados.
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
                    rowsPerPage={pageSize}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50]}
                    labelRowsPerPage="Filas por página"
                />
            </Paper>
        </Box>
    );
}
