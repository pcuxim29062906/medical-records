'use server'

import { prismaGlobal } from '@/database/db';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '../auth/auth';

/*
export async function createConsultation(data: {
    patientId: string;
    weight?: number;
    height?: number;
    temperature?: number;
    bloodPressure?: string;
    glucose?: number;
    interrogation: string; // Obligatorio según tu modelo
    physicalExam?: string;
    diagnosis: string;     // Obligatorio según tu modelo
    medicalPrescription?: string;
    studyOrders?: string;
    appointmentId?: string;
    doctorId?: string; // Lo ideal es sacarlo de la sesión, pero lo dejamos opcional por ahora
}) {
    try {
        const docId = data.doctorId || (await prismaGlobal.user.findFirst())?.id;

        if (!docId) throw new Error("No se encontró un médico para asociar la consulta.");

        const consultation = await prismaGlobal.consultation.create({
            data: {
                patientId: data.patientId,
                weight: data.weight ? parseFloat(data.weight.toString()) : null,
                height: data.height ? parseFloat(data.height.toString()) : null,
                temperature: data.temperature ? parseFloat(data.temperature.toString()) : null,
                glucose: data.glucose ? parseFloat(data.glucose.toString()) : null,
                bloodPressure: data.bloodPressure,
                interrogation: data.interrogation,
                physicalExam: data.physicalExam,
                diagnosis: data.diagnosis,
                medicalPrescription: data.medicalPrescription,
                studyOrders: data.studyOrders,
                appointmentId: data.appointmentId || null,
                doctorId: docId
            }
        });

        // 2. Si hay peso o altura, guardar en el histórico de crecimiento
        if (data.weight || data.height) {
            await prismaGlobal.growthHistory.create({
                data: {
                    patientId: data.patientId,
                    weight: data.weight,
                    height: data.height,
                    date: new Date(),
                }
            });
        }

        // 3. Si viene de una cita, marcarla como completada
        if (data.appointmentId) {
            await prismaGlobal.appointment.update({
                where: { id: data.appointmentId },
                data: { status: 'COMPLETED' }
            });
        }

        revalidatePath(`/admin/patient/${data.patientId}`);
        return { success: true, data: consultation };
    } catch (error) {
        console.error("Error al crear consulta:", error);
        return { success: false, error: "Error al guardar la consulta médica" };
    }
}
*/

export async function createConsultation(data: {
    patientId: string;
    weight?: number;
    height?: number;
    temperature?: number;
    bloodPressure?: string;
    glucose?: number;
    interrogation: string;
    physicalExam?: string;
    diagnosis: string;
    medicalPrescription?: string;
    studyOrders?: string;
    appointmentId?: string;
    doctorId?: string;
}) {
    try {
        return await prismaGlobal.$transaction(async (tx) => {

            const currentUser = await getCurrentUser();

            if (!currentUser) {
                throw new Error("No se está logueado.");
            }

            if (currentUser.role != "DOCTOR") {
                throw new Error("El usuario no puede guardar consultas.");
            }

            // 2. Validar la Cita (si existe)
            if (data.appointmentId) {
                const appointment = await tx.appointment.findUnique({
                    where: { id: data.appointmentId }
                });

                if (!appointment) {
                    throw new Error("La cita especificada no existe.");
                }

                // Verificamos que el doctor de la consulta sea el mismo de la cita
                if (appointment.doctorId !== currentUser.id) {
                    throw new Error("El médico de la consulta no coincide con el médico de la cita.");
                }
            }

            // 3. Crear la Consulta
            const consultation = await tx.consultation.create({
                data: {
                    patientId: data.patientId,
                    doctorId: currentUser.id,
                    weight: data.weight ? parseFloat(data.weight.toString()) : null,
                    height: data.height ? parseFloat(data.height.toString()) : null,
                    temperature: data.temperature ? parseFloat(data.temperature.toString()) : null,
                    glucose: data.glucose ? parseFloat(data.glucose.toString()) : null,
                    bloodPressure: data.bloodPressure,
                    interrogation: data.interrogation,
                    physicalExam: data.physicalExam,
                    diagnosis: data.diagnosis,
                    medicalPrescription: data.medicalPrescription,
                    studyOrders: data.studyOrders,
                    appointmentId: data.appointmentId || null,
                }
            });

            // 4. Guardar en histórico de crecimiento
            if (data.weight || data.height) {
                await tx.growthHistory.create({
                    data: {
                        patientId: data.patientId,
                        weight: data.weight ? parseFloat(data.weight.toString()) : null,
                        height: data.height ? parseFloat(data.height.toString()) : null,
                        date: new Date(),
                    }
                });
            }

            // 5. Marcar cita como completada
            if (data.appointmentId) {
                await tx.appointment.update({
                    where: { id: data.appointmentId },
                    data: { status: 'COMPLETED' }
                });
            }

            revalidatePath(`/admin/patient/${data.patientId}`);
            //revalidatePath('/admin/appointmen'); // Revalidamos también la lista de citas

            return { success: true, data: consultation, error: "" };
        });

    } catch (er: any) {
        console.error("Error al crear consulta:", er);

        // Si es un error lanzado manualmente con throw new Error("...")
        if (er instanceof Error) {
            return { success: false, error: er.message };
        }

        // Si es un error de Prisma u otro tipo que no sea instancia de Error
        if (typeof er === 'string') {
            return { success: false, error: er };
        }

        // Error genérico por si falla algo inesperado
        return {
            success: false,
            error: "Ocurrió un error inesperado al guardar la consulta."
        };
    }
}

export async function getConsultationById(id: string) {
    try {
        const consultation = await prismaGlobal.consultation.findUnique({
            where: { id },
            include: {
                // Traemos los datos básicos del paciente para el encabezado de la vista
                patient: {
                    select: {
                        fullName: true,
                        documentId: true,
                        birthDate: true,
                        gender: true
                    }
                },
                // Si la consulta vino de una cita agendada
                appointment: true
            }
        });

        if (!consultation) {
            return null;
        }

        return consultation;
    } catch (error) {
        console.error("Error al obtener la consulta:", error);
        throw new Error("No se pudo cargar la información de la consulta médica.");
    }
}