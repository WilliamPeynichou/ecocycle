#!/bin/bash

# Script de configuration pour Langchain + Ollama

echo "🚀 Configuration de Langchain + Ollama pour Ecocycle"
echo ""

# Vérifier Ollama
echo "📦 Vérification d'Ollama..."
if command -v ollama &> /dev/null; then
    echo "✓ Ollama est installé"
    ollama list
else
    echo "❌ Ollama n'est pas installé"
    echo ""
    echo "Veuillez installer Ollama :"
    echo "1. Aller sur https://ollama.ai"
    echo "2. Télécharger et installer pour macOS"
    echo "3. Ou utiliser: brew install ollama"
    echo ""
    echo "Ensuite, démarrez Ollama avec: ollama serve"
    echo "Et installez un modèle avec: ollama pull llama2"
    exit 1
fi

# Vérifier que Ollama est en cours d'exécution
echo ""
echo "🔍 Vérification qu'Ollama est en cours d'exécution..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✓ Ollama est actif"
else
    echo "⚠️  Ollama ne semble pas être en cours d'exécution"
    echo "Démarrez Ollama avec: ollama serve"
    exit 1
fi

# Vérifier Python
echo ""
echo "🐍 Vérification de Python..."
if command -v python3 &> /dev/null; then
    echo "✓ Python $(python3 --version) est installé"
else
    echo "❌ Python 3 n'est pas installé"
    exit 1
fi

# Créer l'environnement virtuel
echo ""
echo "📦 Création de l'environnement virtuel Python..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Environnement virtuel créé"
else
    echo "✓ Environnement virtuel existe déjà"
fi

# Activer l'environnement virtuel
echo ""
echo "🔌 Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances
echo ""
echo "📥 Installation des dépendances Python..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo "✓ Dépendances installées"

# Créer le fichier .env
echo ""
echo "⚙️  Configuration de l'environnement..."
if [ ! -f ".env" ]; then
    cp config.env.example .env
    echo "✓ Fichier .env créé depuis config.env.example"
else
    echo "✓ Fichier .env existe déjà"
fi

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "Pour démarrer le service FastAPI :"
echo "  1. source venv/bin/activate"
echo "  2. python main.py"
echo ""
echo "Le service sera accessible sur : http://127.0.0.1:8000"
echo ""
echo "Pour tester :"
echo "  curl http://127.0.0.1:8000/health"

