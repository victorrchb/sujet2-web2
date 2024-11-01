const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Inscription d’un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
};

// Connexion d’un utilisateur existant
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Connexion réussie', token });
    } else {
      res.status(401).json({ error: 'Identifiants incorrects' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};
