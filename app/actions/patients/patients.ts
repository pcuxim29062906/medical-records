'use server'

import { prismaGlobal as db } from '@/database/db';
import { revalidatePath } from 'next/cache';

type GetPatientsInput = {
  page?: number;
  pageSize?: number;
  search?: string;
  gender?: string;
  bloodType?: string;
};

// Crear un nuevo paciente
export async function createPatient(data: {
  fullName: string;
  documentId: string;
  birthDate: Date;
  gender: string;
  bloodType?: string;
  allergies?: string;
  chronicDiseases?: string;
  email?: string;
  phone?: string;
}) {
  try {
    const patient = await db.patient.create({
      data
    });
    revalidatePath('/admin/patient/index'); // Refresca la lista de pacientes
    return { success: true, data: patient };
  } catch (error) {
    return { success: false, error: "Error al crear el paciente" };
  }
}

export async function getPatients(filters: GetPatientsInput = {}) {
  const page = filters.page ?? 0;
  const pageSize = filters.pageSize ?? 10;
  const search = filters.search?.trim();

  const where: any = {
    ...(filters.gender && filters.gender !== 'ALL' && { gender: filters.gender }),
    ...(filters.bloodType && filters.bloodType !== 'ALL' && { bloodType: filters.bloodType }),
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: 'insensitive' } },
        { documentId: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    db.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: page * pageSize,
      take: pageSize,
    }),
    db.patient.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
  };
}

export async function getPatientById(id: string) {
  return await db.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { startDateTime: 'desc' },
        take: 5, // Solo las últimas 5 citas
        include: {
          doctor: true
        }
      },
      consultations: {
        orderBy: { date: 'desc' },
        include:{
          doctor: true
        }
      },
      growthHistory: {
        orderBy: {
          date: "desc",
        }
      },
    }
  });
}