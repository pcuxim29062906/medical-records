// app/actions/studies/studies.ts
'use server'
import { prismaGlobal } from '@/database/db';
import { revalidatePath } from 'next/cache';

export async function getAvailableStudies() {
    return await prismaGlobal.study.findMany({
        orderBy: { category: 'asc' }
    });
}

export async function upsertStudy(data: { id?: string, name: string, category: string, description?: string }) {
    if (data.id) {
        await prismaGlobal.study.update({
            where: { id: data.id },
            data: { name: data.name, category: data.category, description: data.description }
        });
    } else {
        await prismaGlobal.study.create({
            data: { name: data.name, category: data.category, description: data.description }
        });
    }
    revalidatePath('/admin/studies/index');
}

export async function deleteStudy(id: string) {
    await prismaGlobal.study.delete({ where: { id } });
    revalidatePath('/admin/studies/index');
}