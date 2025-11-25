#!/bin/bash

# Script pour démarrer ngrok tunnel pour MySQL MAMP

echo "🚀 Démarrage du tunnel ngrok pour MySQL (port 8889)..."
echo ""
echo "⚠️  IMPORTANT: Si c'est la première fois, vous devez:"
echo "   1. Créer un compte gratuit sur https://ngrok.com"
echo "   2. Obtenir votre token d'authentification"
echo "   3. Exécuter: ngrok config add-authtoken VOTRE_TOKEN"
echo ""

# Vérifier si ngrok est authentifié
if ! ngrok config check > /dev/null 2>&1; then
    echo "❌ ngrok n'est pas authentifié!"
    echo ""
    echo "Pour authentifier ngrok:"
    echo "  1. Allez sur https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "  2. Copiez votre token"
    echo "  3. Exécutez: ngrok config add-authtoken VOTRE_TOKEN"
    exit 1
fi

# Arrêter les tunnels ngrok existants sur le port 8889
pkill -f "ngrok.*8889" 2>/dev/null
sleep 1

# Démarrer le tunnel TCP
echo "✅ Démarrage du tunnel..."
ngrok tcp 8889 --log=stdout &
NGROK_PID=$!

# Attendre que le tunnel soit prêt
sleep 3

# Récupérer l'URL du tunnel
TUNNEL_INFO=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null)

if [ -z "$TUNNEL_INFO" ]; then
    echo "❌ Impossible de se connecter à l'API ngrok"
    echo "   Le tunnel peut nécessiter quelques secondes pour démarrer"
    exit 1
fi

# Extraire l'URL TCP
TCP_URL=$(echo "$TUNNEL_INFO" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for tunnel in data.get('tunnels', []):
        if tunnel.get('proto') == 'tcp':
            url = tunnel.get('public_url', '')
            if url.startswith('tcp://'):
                print(url.replace('tcp://', ''))
                break
except:
    pass
" 2>/dev/null)

if [ -z "$TCP_URL" ]; then
    echo "⚠️  Tunnel en cours de démarrage..."
    echo "   Ouvrez http://localhost:4040 dans votre navigateur pour voir l'URL"
    echo ""
    echo "   Ou attendez quelques secondes et réessayez ce script"
else
    HOST=$(echo "$TCP_URL" | cut -d':' -f1)
    PORT=$(echo "$TCP_URL" | cut -d':' -f2)
    
    echo ""
    echo "✅ Tunnel créé avec succès!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 Configuration pour n8n MySQL:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   Host: $HOST"
    echo "   Port: $PORT"
    echo "   Database: ecocycle (ou votre nom de base)"
    echo "   User: root"
    echo "   Password: (vide ou 'root')"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 Interface web ngrok: http://localhost:4040"
    echo ""
    echo "⚠️  Le tunnel restera actif tant que ce script tourne"
    echo "   Appuyez sur Ctrl+C pour arrêter le tunnel"
    echo ""
fi

# Garder le script actif
wait $NGROK_PID

