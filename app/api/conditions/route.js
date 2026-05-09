import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const species = searchParams.get('species');
    const category = searchParams.get('category');

    const where = { isActive: true };
    if (species && species !== 'otro') {
      where.OR = [{ targetSpecies: species }, { targetSpecies: 'ambos' }];
    }
    if (category) where.category = category;

    const conditions = await prisma.conditionCatalog.findMany({ where, orderBy: { name: 'asc' } });
    return NextResponse.json({ conditions });
  } catch (error) {
    console.error('Get conditions error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
