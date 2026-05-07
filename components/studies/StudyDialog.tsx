'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, MenuItem } from '@mui/material';
import { upsertStudy } from '@/app/actions/studies/studies';

const categories = ["Laboratorio", "Imagenología", "Cardiología", "Especializado", "Anatomia Patologica"];

export default function StudyDialog({ open, onClose, study, onSave }: any) {
    const [formData, setFormData] = useState({ name: '', category: '', description: '' });

    useEffect(() => {
        if (study) setFormData({ name: study.name, category: study.category, description: study.description || '' });
        else setFormData({ name: '', category: '', description: '' });
    }, [study, open]);

    const handleSave = async () => {
        await upsertStudy({ ...formData, id: study?.id });
        onSave();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{study ? 'Editar Estudio' : 'Nuevo Estudio'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Nombre del estudio"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextField
                        select
                        label="Categoría"
                        fullWidth
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </TextField>
                    <TextField
                        label="Descripción"
                        multiline rows={3}
                        fullWidth
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSave} disabled={!formData.name || !formData.category}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}