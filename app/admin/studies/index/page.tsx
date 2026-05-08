'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import { getAvailableStudies, deleteStudy } from '@/app/actions/studies/studies';
import StudyDialog from '@/components/studies/StudyDialog'; // Lo crearemos a continuación

export default function StudiesPage() {
    const [studies, setStudies] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStudy, setSelectedStudy] = useState<any>(null);

    const loadStudies = () => {
        getAvailableStudies().then(setStudies);
    };

    useEffect(() => {
        loadStudies();
    }, []);

    const handleOpenDialog = (study: any = null) => {
        setSelectedStudy(study);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este estudio?')) {
            await deleteStudy(id);
            loadStudies();
        }
    };

    return (
        <Box>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mx: 'auto', borderRadius: 3 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{ mb: 3, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: "space-between" }}
                >
                    <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            Catálogo de Estudios
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gestiona los tipos de estudios y laboratorios disponibles
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start', md: 'center' } }}
                        size="small"
                    >
                        Nuevo Estudio
                    </Button>
                </Stack>

                <TableContainer>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell><strong>Nombre del Estudio</strong></TableCell>
                                <TableCell><strong>Categoría</strong></TableCell>
                                <TableCell><strong>Descripción</strong></TableCell>
                                <TableCell align="right"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {studies.map((study) => (
                                <TableRow key={study.id} hover>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {study.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <FolderSpecialIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{study.category}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        {study.description || 'Sin descripción'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title="Editar">
                                                <IconButton color="info" onClick={() => handleOpenDialog(study)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton color="error" onClick={() => handleDelete(study.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {studies.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                        No hay estudios registrados en el catálogo.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <StudyDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                study={selectedStudy}
                onSave={loadStudies}
            />
        </Box>
    );
}