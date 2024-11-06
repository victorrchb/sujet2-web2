const express = require('express');
const cors = require('cors');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const promBundle = require('express-prom-bundle');
const cache = require('memory-cache');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');

// Configuration du middleware Prometheus
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  promClient: {
    collectDefaultMetrics: {
      timeout: 5000
    }
  }
});

const app = express();

// Middleware de compression
app.use(compression());
app.set('trust proxy', 1);

// Middleware de base
app.use(cors());
app.use(express.json());

// N'utilise pas le middleware de métriques en mode test
if (process.env.NODE_ENV !== 'test') {
  app.use(metricsMiddleware);

  // Middleware de cache (désactivé en mode test)
  app.use((req, res, next) => {
    if (req.method === 'GET') {
      const key = '__express__' + req.originalUrl;
      const cachedBody = cache.get(key);
      
      if (cachedBody) {
        return res.send(cachedBody);
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          cache.put(key, body, 30000); // Cache pour 30 secondes
          res.sendResponse(body);
        };
      }
    }
    next();
  });

  // Documentation Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Route de base pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Project Manager API' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur (sauf en mode test)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;