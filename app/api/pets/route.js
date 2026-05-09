import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const pets = await prisma.pet.findMany({
      where: { ownerId: auth.userId },
      include: {
        qrCode: true,
        vaccinations: { include: { vaccine: true }, orderBy: { applicationDate: 'desc' }, take: 3 },
        conditions: { include: { condition: true }, where: { isCurrent: true } },
        _count: { select: { vaccinations: true, media: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ pets });
  } catch (error) {
    console.error('Get pets error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const body = await request.json();
    const { name, species, breed, birthDate, weightKg, sex, notes, conditions, vaccinations } = body;

    if (!name || !species) {
      return NextResponse.json({ error: 'Nombre y especie son requeridos' }, { status: 400 });
    }

    const petId = uuidv4();
    const shortCode = 'PET' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();

    const pet = await prisma.pet.create({
      data: {
        id: petId,
        ownerId: auth.userId,
        name,
        species,
        breed: breed || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        sex: sex || null,
        notes: notes || null,
      },
    });

    // Create QR code
    await prisma.qrCode.create({
      data: { petId: pet.id, shortCode, isActive: true },
    });

    // Add conditions if provided
    if (conditions && conditions.length > 0) {
      for (const cond of conditions) {
        await prisma.petCondition.create({
          data: {
            petId: pet.id,
            conditionId: parseInt(cond.conditionId),
            notes: cond.notes || null,
            isCurrent: true,
          },
        });
      }
    }

    // Add vaccinations if provided
    if (vaccinations && vaccinations.length > 0) {
      for (const vax of vaccinations) {
        await prisma.vaccinationRecord.create({
          data: {
            petId: pet.id,
            vaccineId: parseInt(vax.vaccineId),
            applicationDate: new Date(vax.applicationDate),
            nextDoseDate: vax.nextDoseDate ? new Date(vax.nextDoseDate) : null,
            veterinarianName: vax.veterinarianName || null,
            batchNumber: vax.batchNumber || null,
            notes: vax.notes || null,
          },
        });
      }
    }

    const fullPet = await prisma.pet.findUnique({
      where: { id: pet.id },
      include: { qrCode: true, vaccinations: { include: { vaccine: true } }, conditions: { include: { condition: true } } },
    });

    return NextResponse.json({ pet: fullPet }, { status: 201 });
  } catch (error) {
    console.error('Create pet error:', error);
    return NextResponse.json({ error: 'Error al crear mascota' }, { status: 500 });
  }
}
