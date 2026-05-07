// Ejemplo en el Server Component de la página
import { getConsultationById } from '@/app/actions/consultations/consultations';
import ConsultationDetail from '@/components/consultation/ConsultationDetail';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

export default async function ViewConsultationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const consultation = await getConsultationById(id);

    if (!consultation) return <p>Consulta no encontrada</p>;

    return (
        <Box >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Detalles de la Consulta
            </Typography>
            <ConsultationDetail consultation={consultation} />
        </Box>
    );
}