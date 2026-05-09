import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, fullName: true, phone: true } },
        qrCode: true,
        vaccinations: { include: { vaccine: true, clinic: true }, orderBy: { applicationDate: 'desc' } },
        conditions: { include: { condition: true } },
        media: { orderBy: { uploadedAt: 'desc' } },
      },
    });

    if (!pet) return NextResponse.json({ error: 'Mascota no encontrada' }, { status: 404 });
    if (pet.ownerId !== auth.userId) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    return NextResponse.json({ pet });
  } catch (error) {
    console.error('Get pet error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    if (pet.ownerId !== auth.userId) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    await prisma.pet.delete({ where: { id } });
    return NextResponse.json({ message: 'Mascota eliminada' });
  } catch (error) {
    console.error('Delete pet error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
