import { prismaGlobal as prisma } from '@/database/db';
import bcrypt from 'bcryptjs';

async function main() {
    const passwordHash = await bcrypt.hash('Clinica2026!', 10);

    // --- USUARIOS (Admin, Doctores, Asistente) ---
    // (Mantener el código anterior de upsert para Admin, Doctores y Asistente aquí...)
    await prisma.user.upsert({
        where: { email: 'admin@clinica.com' },
        update: {},
        create: {
            fullName: 'Administrador Principal',
            email: 'admin@clinica.com',
            passwordHash,
            role: 'ADMIN',
        },
    });

    // 2. Crear Doctores
    const doctors = [
        { name: 'Dr. Alejandro Magno', email: 'alejandro.magno@clinica.com' },
        { name: 'Dra. Beatriz Ortiz', email: 'beatriz.ortiz@clinica.com' }, // Olarte no, Ortiz ;)
    ];

    for (const doc of doctors) {
        await prisma.user.upsert({
            where: { email: doc.email },
            update: {},
            create: {
                fullName: doc.name,
                email: doc.email,
                passwordHash,
                role: 'DOCTOR',
            },
        });
    }

    // 3. Crear Asistente
    await prisma.user.upsert({
        where: { email: 'asistente@clinica.com' },
        update: {},
        create: {
            fullName: 'Asistente Médico',
            email: 'asistente@clinica.com',
            passwordHash,
            role: 'ASSISTANT', // Asegúrate de que este enum exista en tu schema.prisma
        },
    });

    console.log('✅ Seed finalizado: Usuarios creados correctamente.');

    // --- PACIENTES (10 registros adaptados a tu modelo) ---
    const patientsData = [
        { fullName: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-0101', birthDate: new Date('1985-05-15'), documentId: 'DOC-10001', gender: 'Masculino', bloodType: 'O+' },
        { fullName: 'María García', email: 'm.garcia@email.com', phone: '555-0102', birthDate: new Date('1990-08-22'), documentId: 'DOC-10002', gender: 'Femenino', bloodType: 'A+' },
        { fullName: 'Carlos Rodríguez', email: 'carlos.rod@email.com', phone: '555-0103', birthDate: new Date('1978-12-10'), documentId: 'DOC-10003', gender: 'Masculino', bloodType: 'B-' },
        { fullName: 'Ana Martínez', email: 'ana.mtz@email.com', phone: '555-0104', birthDate: new Date('2000-01-30'), documentId: 'DOC-10004', gender: 'Femenino', bloodType: 'O-' },
        { fullName: 'Luis Hernández', email: 'luis.h@email.com', phone: '555-0105', birthDate: new Date('1995-03-12'), documentId: 'DOC-10005', gender: 'Masculino', bloodType: 'AB+' },
        { fullName: 'Elena Gómez', email: 'elena.g@email.com', phone: '555-0106', birthDate: new Date('1982-11-05'), documentId: 'DOC-10006', gender: 'Femenino', bloodType: 'A-' },
        { fullName: 'Roberto Sánchez', email: 'roberto.s@email.com', phone: '555-0107', birthDate: new Date('1965-07-20'), documentId: 'DOC-10007', gender: 'Masculino', bloodType: 'O+' },
        { fullName: 'Lucía Díaz', email: 'lucia.diaz@email.com', phone: '555-0108', birthDate: new Date('1992-09-18'), documentId: 'DOC-10008', gender: 'Femenino', bloodType: 'B+' },
        { fullName: 'Fernando Torres', email: 'f.torres@email.com', phone: '555-0109', birthDate: new Date('1988-04-25'), documentId: 'DOC-10009', gender: 'Masculino', bloodType: 'A+' },
        { fullName: 'Patricia Ruiz', email: 'p.ruiz@email.com', phone: '555-0110', birthDate: new Date('1998-02-14'), documentId: 'DOC-10010', gender: 'Femenino', bloodType: 'O+' },
    ];

    console.log('Creando pacientes...');

    for (const patient of patientsData) {
        await prisma.patient.upsert({
            where: { documentId: patient.documentId }, // Usamos documentId que es @unique
            update: {},
            create: {
                fullName: patient.fullName,
                documentId: patient.documentId,
                birthDate: patient.birthDate,
                gender: patient.gender,
                bloodType: patient.bloodType,
                email: patient.email,
                phone: patient.phone,
                // allergies y chronicDiseases son opcionales según tu modelo
            },
        });
    }

    console.log('✅ Seed finalizado: Usuarios y 10 pacientes creados.');
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });