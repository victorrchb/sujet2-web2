const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('password', 10);
    await User.create({
      username: 'Test User',
      email: 'test@test.com',
      password: hashedPassword
    });
    console.log('Utilisateur de test créé avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
  }
  process.exit();
}

createTestUser();