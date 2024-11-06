#!/bin/bash

echo "🚀 Démarrage des tests QA..."

# Tests unitaires
echo "📋 Exécution des tests unitaires..."
npm test

# Tests de performance
echo "⚡ Exécution des tests de performance..."
npm run test:performance

# Vérification de la couverture
echo "📊 Vérification de la couverture des tests..."
npm run test:coverage

# Linting
echo "🔍 Vérification du code..."
npm run lint

echo "✅ Tests QA terminés"