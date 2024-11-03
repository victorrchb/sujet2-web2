const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Ne démarrer le serveur que si ce n'est pas un test
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  db.sequelize.sync()
    .then(() => {
      console.log('Base de données synchronisée');
      app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Erreur de synchronisation:', err);
    });
}

module.exports = app;