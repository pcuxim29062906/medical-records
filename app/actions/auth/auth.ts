'use server';

import { prismaGlobal as prisma } from '@/database/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE = 'clinic_session';

function hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export async function loginUser(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
        return { success: false, error: 'Credenciales inválidas.' };
    }

    const passwordIsValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordIsValid) {
        return { success: false, error: 'Credenciales inválidas.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
        data: {
            tokenHash,
            expiresAt,
            userId: user.id,
        },
    });

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        path: '/',
    });

    return { success: true };
}

export async function logoutUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (token) {
        await prisma.session.deleteMany({
            where: {
                tokenHash: hashToken(token),
            },
        });
    }

    cookieStore.delete(SESSION_COOKIE);
    redirect('/login');
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) return null;

    const session = await prisma.session.findUnique({
        where: {
            tokenHash: hashToken(token),
        },
        include: {
            user: true,
        },
    });

    if (!session || session.expiresAt < new Date() || !session.user.isActive) {
        return null;
    }

    return session.user;
}

export async function requireUser() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    return user;
}
