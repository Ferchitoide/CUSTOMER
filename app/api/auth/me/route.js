import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, fullName: true, email: true, phone: true, district: true, city: true },
    });
    if (!user) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
