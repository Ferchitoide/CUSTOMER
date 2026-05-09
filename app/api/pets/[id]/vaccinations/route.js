import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet || pet.ownerId !== auth.userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { vaccineId, applicationDate, nextDoseDate, veterinarianName, batchNumber, notes } = body;

    if (!vaccineId || !applicationDate) {
      return NextResponse.json({ error: 'Vacuna y fecha son requeridas' }, { status: 400 });
    }

    const record = await prisma.vaccinationRecord.create({
      data: {
        petId: id,
        vaccineId: parseInt(vaccineId),
        applicationDate: new Date(applicationDate),
        nextDoseDate: nextDoseDate ? new Date(nextDoseDate) : null,
        veterinarianName: veterinarianName || null,
        batchNumber: batchNumber || null,
        notes: notes || null,
      },
      include: { vaccine: true },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error('Create vaccination error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
