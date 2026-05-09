require('dotenv').config();
const Database = require('better-sqlite3');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // ── 1. Vacunas Estándar (Perú) ──
  const vaccines = [
    { name: 'Quíntuple (DHLPP)', targetSpecies: 'perro', description: 'Distemper, Hepatitis, Leptospirosis, Parainfluenza, Parvovirus', recommendedFrequency: 'Anual', displayOrder: 1 },
    { name: 'Séxtuple', targetSpecies: 'perro', description: 'Quíntuple + Coronavirus canino', recommendedFrequency: 'Anual', displayOrder: 2 },
    { name: 'Óctuple', targetSpecies: 'perro', description: 'Séxtuple + Leptospirosis cepas adicionales', recommendedFrequency: 'Anual', displayOrder: 3 },
    { name: 'Antirrábica Canina', targetSpecies: 'perro', description: 'Obligatoria por ley en Perú', recommendedFrequency: 'Anual', displayOrder: 4 },
    { name: 'Bordetella', targetSpecies: 'perro', description: 'Tos de Perreras', recommendedFrequency: 'Anual', displayOrder: 5 },
    { name: 'Giardia', targetSpecies: 'perro', description: 'Zonas endémicas', recommendedFrequency: 'Anual', displayOrder: 6 },
    { name: 'Triple Felina (PRC)', targetSpecies: 'gato', description: 'Panleucopenia, Rinotraqueitis, Calicivirus', recommendedFrequency: 'Anual', displayOrder: 7 },
    { name: 'Antirrábica Felina', targetSpecies: 'gato', description: 'Obligatoria por ley en Perú', recommendedFrequency: 'Anual', displayOrder: 8 },
    { name: 'Leucemia Felina (FeLV)', targetSpecies: 'gato', description: 'Gatos con acceso exterior', recommendedFrequency: 'Anual', displayOrder: 9 },
    { name: 'PIF', targetSpecies: 'gato', description: 'Peritonitis Infecciosa Felina', recommendedFrequency: 'Según veterinario', displayOrder: 10 },
    { name: 'Desparasitación Interna', targetSpecies: 'ambos', description: 'Control parasitario', recommendedFrequency: 'Cada 3-6 meses', displayOrder: 11 },
    { name: 'Desparasitación Externa', targetSpecies: 'ambos', description: 'Pulgas y garrapatas', recommendedFrequency: 'Mensual', displayOrder: 12 },
  ];
  for (const v of vaccines) await prisma.standardVaccine.create({ data: v });
  console.log('✅ Vacunas:', vaccines.length);

  // ── 2. Condiciones ──
  const conditions = [
    { name: 'Alergia alimentaria', category: 'alergia', targetSpecies: 'ambos' },
    { name: 'Alergia al pollo', category: 'alergia', targetSpecies: 'ambos' },
    { name: 'Alergia a pulgas (DAPP)', category: 'alergia', targetSpecies: 'ambos' },
    { name: 'Alergia atópica', category: 'alergia', targetSpecies: 'ambos' },
    { name: 'Alergia a medicamentos', category: 'alergia', targetSpecies: 'ambos' },
    { name: 'Displasia de cadera', category: 'enfermedad_cronica', targetSpecies: 'perro' },
    { name: 'Epilepsia', category: 'enfermedad_cronica', targetSpecies: 'ambos' },
    { name: 'Diabetes mellitus', category: 'enfermedad_cronica', targetSpecies: 'ambos' },
    { name: 'Insuficiencia renal crónica', category: 'enfermedad_cronica', targetSpecies: 'ambos' },
    { name: 'Enfermedad cardíaca', category: 'enfermedad_cronica', targetSpecies: 'ambos' },
    { name: 'Hipotiroidismo', category: 'enfermedad_cronica', targetSpecies: 'perro' },
    { name: 'Hipertiroidismo', category: 'enfermedad_cronica', targetSpecies: 'gato' },
    { name: 'Artritis', category: 'enfermedad_cronica', targetSpecies: 'ambos' },
    { name: 'Enfermedad periodontal', category: 'enfermedad_cronica', targetSpecies: 'ambos' },
    { name: 'Sobrepeso / Obesidad', category: 'condicion', targetSpecies: 'ambos' },
    { name: 'Piel sensible', category: 'condicion', targetSpecies: 'ambos' },
    { name: 'Ansiedad por separación', category: 'condicion', targetSpecies: 'perro' },
  ];
  for (const c of conditions) await prisma.conditionCatalog.create({ data: c });
  console.log('✅ Condiciones:', conditions.length);

  // ── 3. Clínicas ──
  const clinic1Id = uuidv4();
  const clinic2Id = uuidv4();
  await prisma.clinic.createMany({
    data: [
      { id: clinic1Id, name: 'Veterinaria San Francisco', ruc: '20456789012', address: 'Av. Larco 456', district: 'Miraflores', city: 'Lima', phone: '+51 1 445 6789', email: 'contacto@vetsanfrancisco.pe', isAffiliated: true, monthlyFee: 29.00 },
      { id: clinic2Id, name: 'Clínica Veterinaria El Buen Pastor', ruc: '20567890123', address: 'Av. La Marina 1234', district: 'San Miguel', city: 'Lima', phone: '+51 1 567 8901', email: 'info@vetbuenpastor.pe', isAffiliated: false },
    ],
  });
  console.log('✅ Clínicas: 2');

  // ── 4. Usuarios ──
  const hash = await bcrypt.hash('Test1234!', 12);
  const users = [
    { id: uuidv4(), fullName: 'María Elena Quispe Huamán', email: 'maria.quispe@gmail.com', phone: '+51 987 654 321', passwordHash: hash, district: 'San Miguel', city: 'Lima' },
    { id: uuidv4(), fullName: 'Carlos Alberto Mendoza Ríos', email: 'carlos.mendoza@hotmail.com', phone: '+51 912 345 678', passwordHash: hash, district: 'Miraflores', city: 'Lima' },
    { id: uuidv4(), fullName: 'Ana Lucía Fernández Paredes', email: 'ana.fernandez@gmail.com', phone: '+51 945 678 123', passwordHash: hash, district: 'Yanahuara', city: 'Arequipa' },
    { id: uuidv4(), fullName: 'José Miguel Torres Castillo', email: 'jose.torres@outlook.com', phone: '+51 976 543 210', passwordHash: hash, district: 'Trujillo', city: 'La Libertad' },
    { id: uuidv4(), fullName: 'Patricia Sofía Vargas Díaz', email: 'patricia.vargas@gmail.com', phone: '+51 934 567 890', passwordHash: hash, district: 'San Borja', city: 'Lima' },
  ];
  for (const u of users) await prisma.user.create({ data: u });
  console.log('✅ Usuarios:', users.length);

  // ── 5. Mascotas ──
  const pets = [
    { id: uuidv4(), ownerId: users[0].id, name: 'Firulais', species: 'perro', breed: 'Mestizo', birthDate: new Date('2022-03-15'), weightKg: 12.5, sex: 'macho' },
    { id: uuidv4(), ownerId: users[1].id, name: 'Luna', species: 'gato', breed: 'Persa', birthDate: new Date('2021-08-20'), weightKg: 4.2, sex: 'hembra' },
    { id: uuidv4(), ownerId: users[2].id, name: 'Rocky', species: 'perro', breed: 'Golden Retriever', birthDate: new Date('2020-11-05'), weightKg: 32.0, sex: 'macho' },
    { id: uuidv4(), ownerId: users[3].id, name: 'Michi', species: 'gato', breed: 'Siamés', birthDate: new Date('2023-01-10'), weightKg: 3.8, sex: 'macho' },
    { id: uuidv4(), ownerId: users[3].id, name: 'Canela', species: 'perro', breed: 'Labrador', birthDate: new Date('2021-06-22'), weightKg: 28.5, sex: 'hembra' },
    { id: uuidv4(), ownerId: users[4].id, name: 'Max', species: 'perro', breed: 'Bulldog Francés', birthDate: new Date('2023-04-01'), weightKg: 11.0, sex: 'macho' },
  ];
  for (const p of pets) await prisma.pet.create({ data: p });
  console.log('✅ Mascotas:', pets.length);

  // ── 6. Vacunaciones ──
  const vaxRecords = [
    { petId: pets[0].id, vaccineId: 1, applicationDate: new Date('2022-05-15'), nextDoseDate: new Date('2023-05-15'), veterinarianName: 'Dr. Roberto Sánchez', clinicId: clinic2Id },
    { petId: pets[0].id, vaccineId: 4, applicationDate: new Date('2022-06-20'), nextDoseDate: new Date('2023-06-20'), veterinarianName: 'Dr. Roberto Sánchez', clinicId: clinic2Id },
    { petId: pets[1].id, vaccineId: 7, applicationDate: new Date('2021-10-20'), nextDoseDate: new Date('2022-10-20'), veterinarianName: 'Dra. Lucía Paredes', clinicId: clinic1Id },
    { petId: pets[1].id, vaccineId: 8, applicationDate: new Date('2021-11-25'), nextDoseDate: new Date('2022-11-25'), veterinarianName: 'Dra. Lucía Paredes', clinicId: clinic1Id },
    { petId: pets[1].id, vaccineId: 9, applicationDate: new Date('2022-01-10'), nextDoseDate: new Date('2023-01-10'), veterinarianName: 'Dra. Lucía Paredes', clinicId: clinic1Id },
    { petId: pets[2].id, vaccineId: 2, applicationDate: new Date('2021-01-15'), nextDoseDate: new Date('2022-01-15'), veterinarianName: 'Dr. Mario Chávez' },
    { petId: pets[2].id, vaccineId: 4, applicationDate: new Date('2021-02-20'), nextDoseDate: new Date('2022-02-20'), veterinarianName: 'Dr. Mario Chávez' },
    { petId: pets[2].id, vaccineId: 5, applicationDate: new Date('2021-03-10'), nextDoseDate: new Date('2022-03-10'), veterinarianName: 'Dr. Mario Chávez' },
    { petId: pets[3].id, vaccineId: 7, applicationDate: new Date('2023-03-15'), nextDoseDate: new Date('2024-03-15'), veterinarianName: 'Dra. Sandra Flores' },
    { petId: pets[4].id, vaccineId: 1, applicationDate: new Date('2021-08-25'), nextDoseDate: new Date('2022-08-25'), veterinarianName: 'Dra. Sandra Flores' },
    { petId: pets[4].id, vaccineId: 4, applicationDate: new Date('2021-09-30'), nextDoseDate: new Date('2022-09-30'), veterinarianName: 'Dra. Sandra Flores' },
    { petId: pets[5].id, vaccineId: 1, applicationDate: new Date('2023-06-10'), nextDoseDate: new Date('2024-06-10'), veterinarianName: 'Dr. Andrés Villanueva', clinicId: clinic1Id },
    { petId: pets[5].id, vaccineId: 4, applicationDate: new Date('2023-07-15'), nextDoseDate: new Date('2024-07-15'), veterinarianName: 'Dr. Andrés Villanueva', clinicId: clinic1Id },
    { petId: pets[5].id, vaccineId: 6, applicationDate: new Date('2023-08-20'), nextDoseDate: new Date('2024-08-20'), veterinarianName: 'Dr. Andrés Villanueva', clinicId: clinic1Id },
  ];
  for (const vr of vaxRecords) await prisma.vaccinationRecord.create({ data: vr });
  console.log('✅ Vacunaciones:', vaxRecords.length);

  // ── 7. Condiciones de mascotas ──
  const petConds = [
    { petId: pets[1].id, conditionId: 1, diagnosedDate: new Date('2022-06-15'), notes: 'Sensible a granos', isCurrent: true },
    { petId: pets[2].id, conditionId: 6, diagnosedDate: new Date('2023-03-10'), notes: 'Condroprotectores', isCurrent: true },
    { petId: pets[5].id, conditionId: 16, diagnosedDate: new Date('2023-09-01'), notes: 'Shampoo hipoalergénico', isCurrent: true },
    { petId: pets[5].id, conditionId: 3, diagnosedDate: new Date('2023-10-15'), notes: 'Antipulgas mensual', isCurrent: true },
    { petId: pets[4].id, conditionId: 15, diagnosedDate: new Date('2024-01-20'), notes: 'Plan de dieta', isCurrent: true },
  ];
  for (const pc of petConds) await prisma.petCondition.create({ data: pc });
  console.log('✅ Condiciones mascotas:', petConds.length);

  // ── 8. QR Codes ──
  for (let i = 0; i < pets.length; i++) {
    await prisma.qrCode.create({ data: { petId: pets[i].id, shortCode: `PET${String(i + 1).padStart(6, '0')}`, isActive: true } });
  }
  console.log('✅ QR codes:', pets.length);

  console.log('\n🎉 Seed completado!');
  console.log('📧 Login con contraseña: Test1234!');
  users.forEach(u => console.log(`   - ${u.email}`));
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
