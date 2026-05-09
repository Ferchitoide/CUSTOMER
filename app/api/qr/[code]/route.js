import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { code } = await params;

    const qrCode = await prisma.qrCode.findUnique({
      where: { shortCode: code },
      include: {
        pet: {
          include: {
            owner: { select: { fullName: true, phone: true, city: true } },
            vaccinations: { include: { vaccine: true, clinic: true }, orderBy: { applicationDate: 'desc' } },
            conditions: { include: { condition: true }, where: { isCurrent: true } },
            media: { where: { mediaType: 'photo' }, take: 4, orderBy: { uploadedAt: 'desc' } },
          },
        },
      },
    });

    if (!qrCode || !qrCode.isActive) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ pet: qrCode.pet, shortCode: code });
  } catch (error) {
    console.error('QR lookup error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
