'use server';

import { prismaGlobal as prisma } from '@/database/db';

export async function getDoctors() {
    try {
        const doctors = await prisma.user.findMany({
            where: {
                // Ajusta 'DOCTOR' al nombre exacto del rol que uses en tu DB
                role: 'DOCTOR', 
            },
            select: {
                id: true,
                fullName: true,
                // Puedes traer otros campos si los necesitas en el select del UI
            },
            orderBy: {
                fullName: 'asc',
            },
        });
        return doctors;
    } catch (error) {
        console.error("Error al obtener médicos:", error);
        return [];
    }
}