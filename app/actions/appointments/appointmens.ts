'use server';

import { revalidatePath } from 'next/cache';
import { prismaGlobal as prisma } from '@/database/db';

type CreateAppointmentInput = {
    patientId: string;
    startDateTime: Date;
    endDateTime: Date;
    reason?: string;
    doctorId: string
};

export async function getAppointments(doctorId?: string) {
    return prisma.appointment.findMany({
        include: {
            patient: true,
            consultation: true,
            doctor: true
        },
        where: {
            // Si doctorId existe, filtra por él; si no, trae todos
            ...(doctorId && { doctorId: doctorId })
        },
        orderBy: {
            startDateTime: 'asc',
        },
    });
}

export async function getAppointmentById(id: string) {
    return prisma.appointment.findUnique({
        where: { id },
        include: {
            patient: true,
            consultation: true,
            doctor: true,
        },
    });
}

export async function createAppointment(data: CreateAppointmentInput) {
    try {
        if (!data.patientId) {
            return { success: false, error: 'Selecciona un paciente.' };
        }

        if (data.startDateTime >= data.endDateTime) {
            return { success: false, error: 'La hora de fin debe ser mayor a la hora de inicio.' };
        }

        const conflict = await prisma.appointment.findFirst({
            where: {
                patientId: data.patientId,
                status: {
                    in: ['PENDING', 'CONFIRMED'],
                },
                startDateTime: {
                    lt: data.endDateTime,
                },
                endDateTime: {
                    gt: data.startDateTime,
                },
            },
        });

        if (conflict) {
            return { success: false, error: 'El paciente ya tiene una cita en ese horario.' };
        }

        const appointment = await prisma.appointment.create({
            data: {
                patientId: data.patientId,
                startDateTime: data.startDateTime,
                endDateTime: data.endDateTime,
                reason: data.reason,
                status: 'PENDING',
                doctorId: data.doctorId
            },
        });

        revalidatePath('/admin/appointmen/index');
        return { success: true, appointment };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'No se pudo crear la cita.' };
    }
}

export async function updateAppointmentStatus(id: string, status: string) {
    try {
        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status },
        });

        revalidatePath('/admin/appointmen/index');
        return { success: true, appointment };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'No se pudo actualizar la cita.' };
    }
}
