import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, password, district, city } = body;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { fullName, email, phone, passwordHash, district: district || null, city: city || null },
    });

    const token = generateToken(user.id);
    const response = NextResponse.json({
      message: 'Registro exitoso',
      user: { id: user.id, fullName: user.fullName, email: user.email },
    }, { status: 201 });

    response.cookies.set('auth_token', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
