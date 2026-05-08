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

type GetAppointmentsInput = {
    page?: number;
    pageSize?: number;
    doctorId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
};

export async function getAppointments(filters: GetAppointmentsInput = {}) {
    const page = filters.page ?? 0;
    const pageSize = filters.pageSize ?? 10;

    const where: any = {
        ...(filters.doctorId && { doctorId: filters.doctorId }),
        ...(filters.status && filters.status !== 'ALL' && { status: filters.status }),
    };

    if (filters.startDate || filters.endDate) {
        where.startDateTime = {
            ...(filters.startDate && {
                gte: new Date(`${filters.startDate}T00:00:00`),
            }),
            ...(filters.endDate && {
                lte: new Date(`${filters.endDate}T23:59:59`),
            }),
        };
    }

    const [items, total] = await Promise.all([
        prisma.appointment.findMany({
            where,
            include: {
                patient: true,
                consultation: true,
                doctor: true,
            },
            orderBy: {
                startDateTime: 'asc',
            },
            skip: page * pageSize,
            take: pageSize,
        }),
        prisma.appointment.count({ where }),
    ]);

    return {
        items,
        total,
        page,
        pageSize,
    };
}

export async function getAppointmentById(id: string) {
    return prisma.appointment.findUnique({
        where: { id },
        include: {
            patient: true,
            consultation: true,
            doctor: {
                include: {
                    doctorProfile: true
                }
            },
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
