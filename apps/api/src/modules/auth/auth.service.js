const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';

class AuthService {
  async register(data) {
    const { email, password, full_name, school, major } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw { code: 'EMAIL_IN_USE', message: 'Email đã được sử dụng' };
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        full_name,
        school,
        major
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    };
  }

  async login(data) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw { code: 'USER_NOT_FOUND', message: 'Email không tồn tại' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw { code: 'INVALID_CREDENTIALS', message: 'Mật khẩu không đúng' };
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    };
  }

  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        school: true,
        major: true,
        role: true,
        created_at: true
      }
    });
    
    if (!user) {
        throw { code: 'USER_NOT_FOUND', message: 'Người dùng không tồn tại' };
    }
    return user;
  }

  async updateMe(userId, data) {
    const { full_name, avatar_url, school, major } = data;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(full_name && { full_name }),
        ...(avatar_url && { avatar_url }),
        ...(school && { school }),
        ...(major && { major })
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        school: true,
        major: true,
        role: true,
        updated_at: true
      }
    });

    return user;
  }
}

module.exports = new AuthService();
