import { Adapter } from 'next-auth/adapters';
import { prisma } from './prisma';

export const CustomAdapter: Adapter = {
  async getUserByEmail(email) {
    if (!email) {
      console.error('getUserByEmail: El argumento "email" es inválido o nulo.');
      return null;
    }
  
    try {
      const user = await prisma.users.findUnique({
        where: { email },
      });
  
      if (!user) return null;
  
      return {
        id: user.id.toString(),
        email: user.email,
        emailVerified: user.emailVerified || null,
        role: user.role || 'user',
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      };
    } catch (error) {
      console.error('Error in getUserByEmail:', error);
      throw new Error('Database error in getUserByEmail');
    }
  }
  ,
  
  async createVerificationToken({ identifier, token, expires }) {
      try {
      await prisma.verification_tokens.create({
          data: {
          identifier,
          token,
          expires,
          },
      });
      return { identifier, token, expires };
      } catch (error) {
      console.error('Error in createVerificationToken:', error);
      throw new Error('Database error in createVerificationToken');
      }
  },

  async useVerificationToken({ identifier, token }) {
      try {
      const existingToken = await prisma.verification_tokens.findUnique({
          where: { identifier_token: { identifier, token } },
      });

      if (!existingToken) return null;

      await prisma.verification_tokens.delete({
          where: { identifier_token: { identifier, token } },
      });

      return existingToken;
      } catch (error) {
      console.error('Error in useVerificationToken:', error);
      throw new Error('Database error in useVerificationToken');
      }
  },

  async updateUser(user) {
    try {
      const updatedUser = await prisma.users.update({
        where: { id: BigInt(user.id) },
        data: {
          email: user.email || undefined,
          first_name: user.name?.split(' ')[0] || undefined,
          last_name: user.name?.split(' ')[1] || undefined,
          emailVerified: user.emailVerified || null,
          role: user.role || undefined,
        },
      });
  
      return {
        id: updatedUser.id.toString(),
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        role: updatedUser.role || 'user',
        name: `${updatedUser.first_name || ''} ${updatedUser.last_name || ''}`.trim(),
      };
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw new Error('Database error in updateUser');
    }
  }  
};