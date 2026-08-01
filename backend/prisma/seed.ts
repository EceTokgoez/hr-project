import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
  const hashedPassword = await bcrypt.hash('123456', SALT_ROUNDS);

  const manager = await prisma.user.upsert({
    where: { email: 'manager@test.com' },
    update: { department: 'İnsan Kaynakları Departmanı' },
    create: {
      fullName: 'Ayşe Yılmaz',
      employeeNumber: 'M001',
      email: 'manager@test.com',
      password: hashedPassword,
      department: 'İnsan Kaynakları Departmanı',
      role: 'MANAGER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'employee@test.com' },
    update: { department: 'Bilgi Teknolojileri ve AR-GE Departmanları' },
    create: {
      fullName: 'Mehmet Demir',
      employeeNumber: 'E001',
      email: 'employee@test.com',
      password: hashedPassword,
      department: 'Bilgi Teknolojileri ve AR-GE Departmanları',
      role: 'EMPLOYEE',
      managerId: manager.id,
    },
  });

  console.log('Seed verileri oluşturuldu.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
