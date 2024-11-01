const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Le serveur fonctionne!' });
});

// Synchronisation de la base de données
sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de données synchronisée');
    
    // Démarrage du serveur
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de synchronisation de la base de données:', err);
  });