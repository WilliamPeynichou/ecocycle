#!/bin/bash

# Script pour créer un tunnel TCP gratuit vers MySQL MAMP avec Cloudflare
# Cloudflare Tunnel est gratuit et ne nécessite pas de compte

echo "🚀 Démarrage du tunnel Cloudflare pour MySQL (port 8889)..."
echo ""
echo "📌 Utilisation de Cloudflare Tunnel (gratuit, fiable)"
echo ""

# Arrêter les tunnels cloudflared existants
pkill -f "cloudflared.*8889" 2>/dev/null
sleep 1

echo "✅ Création du tunnel TCP..."
echo "   (Cela peut prendre quelques secondes...)"
echo ""

# Démarrer le tunnel TCP
cloudflared tunnel --url tcp://localhost:8889 2>&1 | tee /tmp/cloudflared_mysql.log &
TUNNEL_PID=$!

# Attendre que le tunnel soit prêt
sleep 5

# Extraire l'URL du tunnel depuis les logs
TUNNEL_URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cloudflared_mysql.log 2>/dev/null | head -1)

if [ -z "$TUNNEL_URL" ]; then
    # Essayer de récupérer depuis la sortie standard
    TUNNEL_INFO=$(cat /tmp/cloudflared_mysql.log 2>/dev/null | grep -i "trycloudflare\|tunnel\|https://" | head -3)
    
    if [ -z "$TUNNEL_INFO" ]; then
        echo "⏳ Tunnel en cours de création..."
        echo ""
        echo "📋 Vérifiez les logs ci-dessus pour l'URL du tunnel"
        echo "   Ou consultez: cat /tmp/cloudflared_mysql.log"
        echo ""
    else
        echo "$TUNNEL_INFO"
        echo ""
    fi
else
    # Extraire host et port depuis l'URL
    HOST_PORT=$(echo "$TUNNEL_URL" | sed 's|https://||')
    HOST=$(echo "$HOST_PORT" | cut -d':' -f1)
    PORT=$(echo "$HOST_PORT" | cut -d':' -f2)
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ TUNNEL CRÉÉ AVEC SUCCÈS!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 Configuration pour n8n MySQL:"
    echo ""
    echo "   Host: $HOST"
    echo "   Port: $PORT"
    echo "   Database: ecocycle (ou votre nom de base)"
    echo "   User: root"
    echo "   Password: (vide ou 'root')"
    echo ""
    echo "🌐 URL complète: $TUNNEL_URL"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

echo "⚠️  Le tunnel restera actif tant que ce script tourne"
echo "   Appuyez sur Ctrl+C pour arrêter le tunnel"
echo ""
echo "💡 Pour voir les logs en temps réel:"
echo "   tail -f /tmp/cloudflared_mysql.log"
echo ""

# Garder le script actif
wait $TUNNEL_PID

