import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const species = searchParams.get('species');

    const where = { isActive: true };
    if (species && species !== 'otro') {
      where.OR = [{ targetSpecies: species }, { targetSpecies: 'ambos' }];
    }

    const vaccines = await prisma.standardVaccine.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ vaccines });
  } catch (error) {
    console.error('Get vaccines error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
