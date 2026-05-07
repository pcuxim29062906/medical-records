'use server'

import { prismaGlobal as db } from '@/database/db';
import { revalidatePath } from 'next/cache';

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

// Obtener todos los pacientes
export async function getPatients() {
  return await db.patient.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getPatientById(id: string) {
  return await db.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { startDateTime: 'desc' },
        take: 5 // Solo las últimas 5 citas
      },
      consultations: {
        orderBy: { date: 'desc' }
      }
    }
  });
}