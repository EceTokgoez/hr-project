import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { AppError } from '../utils/AppError';

const TOKEN_EXPIRES_IN = '8h';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { manager: { select: { fullName: true } } },
  });

  if (!user) {
    throw new AppError(401, 'E-posta veya şifre hatalı.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, 'E-posta veya şifre hatalı.');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
    expiresIn: TOKEN_EXPIRES_IN,
  });

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      employeeNumber: user.employeeNumber,
      email: user.email,
      department: user.department,
      managerName: user.manager?.fullName ?? null,
      role: user.role,
    },
  };
}
