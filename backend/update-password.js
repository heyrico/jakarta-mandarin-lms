const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('finance123', 10);
    
    // Update user Finance
    const updatedUser = await prisma.user.update({
      where: { email: 'finance@jakartamandarin.com' },
      data: { password: hashedPassword }
    });
    
    console.log('Password updated successfully!');
    console.log('User:', updatedUser.email);
    
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword(); 