import { prismaGlobal as prisma } from '@/database/db';
import bcrypt from 'bcryptjs';

async function main() {
    const passwordHash = await bcrypt.hash('Admin12345', 10);

    await prisma.user.upsert({
        where: { email: 'admin@clinica.com' },
        update: {},
        create: {
            fullName: 'Administrador',
            email: 'admin@clinica.com',
            passwordHash,
            role: 'ADMIN',
        },
    });
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
