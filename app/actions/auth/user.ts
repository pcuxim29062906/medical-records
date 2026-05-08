'use server';

import { prismaGlobal as prisma } from '@/database/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

type GetUsersInput = {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    isActive?: string;
};

type UserInput = {
    fullName: string;
    email: string;
    password?: string;
    role: string;
    isActive?: boolean;
    doctorProfile?: {
        professionalLicense?: string;
        specialty?: string;
        subspecialty?: string;
        university?: string;
        phone?: string;
        office?: string;
    };
};

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

export async function getUsers(filters: GetUsersInput = {}) {
    const page = filters.page ?? 0;
    const pageSize = filters.pageSize ?? 10;
    const search = filters.search?.trim();

    const where: any = {
        ...(filters.role && filters.role !== 'ALL' && { role: filters.role }),
        ...(filters.isActive !== undefined &&
            filters.isActive !== 'ALL' && {
            isActive: filters.isActive === 'true',
        }),
        ...(search && {
            OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ],
        }),
    };

    const [items, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                doctorProfile: true,
            },
            orderBy: { createdAt: 'desc' },
            skip: page * pageSize,
            take: pageSize,
        }),
        prisma.user.count({ where }),
    ]);

    return { items, total, page, pageSize };
}

export async function createUser(data: UserInput) {
    try {
        if (!data.password) {
            return { success: false, error: 'La contraseña es requerida.' };
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                fullName: data.fullName,
                email: data.email.toLowerCase().trim(),
                passwordHash,
                role: data.role,
                isActive: data.isActive ?? true,
                ...(data.role === 'DOCTOR' && data.doctorProfile
                    ? {
                        doctorProfile: {
                            create: {
                                professionalLicense: data.doctorProfile.professionalLicense || '',
                                specialty: data.doctorProfile.specialty,
                                subspecialty: data.doctorProfile.subspecialty,
                                university: data.doctorProfile.university,
                                phone: data.doctorProfile.phone,
                                office: data.doctorProfile.office,
                            },
                        },
                    }
                    : {}),
            },
        });

        revalidatePath('/admin/users/index');
        return { success: true, data: user };
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return { success: false, error: 'Ya existe un usuario con ese correo.' };
        }

        return { success: false, error: 'No se pudo crear el usuario.' };
    }
}

export async function updateUser(id: string, data: UserInput) {
    try {
        const passwordData = data.password
            ? { passwordHash: await bcrypt.hash(data.password, 10) }
            : {};

        const user = await prisma.user.update({
            where: { id },
            data: {
                fullName: data.fullName,
                email: data.email.toLowerCase().trim(),
                role: data.role,
                isActive: data.isActive ?? true,
                ...passwordData,
            },
        });

        if (data.role === 'DOCTOR') {
            await prisma.doctorProfile.upsert({
                where: { userId: id },
                update: {
                    professionalLicense: data.doctorProfile?.professionalLicense || '',
                    specialty: data.doctorProfile?.specialty,
                    subspecialty: data.doctorProfile?.subspecialty,
                    university: data.doctorProfile?.university,
                    phone: data.doctorProfile?.phone,
                    office: data.doctorProfile?.office,
                },
                create: {
                    userId: id,
                    professionalLicense: data.doctorProfile?.professionalLicense || '',
                    specialty: data.doctorProfile?.specialty,
                    subspecialty: data.doctorProfile?.subspecialty,
                    university: data.doctorProfile?.university,
                    phone: data.doctorProfile?.phone,
                    office: data.doctorProfile?.office,
                },
            });
        }

        revalidatePath('/admin/users/index');
        return { success: true, data: user };
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return { success: false, error: 'Ya existe un usuario con ese correo o cédula.' };
        }

        return { success: false, error: 'No se pudo actualizar el usuario.' };
    }
}

export async function toggleUserActive(id: string, isActive: boolean) {
    try {
        const user = await prisma.user.update({
            where: { id },
            data: { isActive },
        });

        revalidatePath('/admin/users/index');
        return { success: true, data: user };
    } catch {
        return { success: false, error: 'No se pudo actualizar el estado del usuario.' };
    }
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            doctorProfile: {
                select: {
                    id: true,
                    professionalLicense: true,
                    specialty: true,
                    subspecialty: true,
                    university: true,
                    phone: true,
                    office: true,
                    signatureUrl: true,
                },
            },
        },
    });
}
