#!/bin/bash

# Script pour créer un tunnel TCP gratuit vers MySQL MAMP avec localhost.run
# Utilise SSH (déjà installé sur Mac) - Gratuit, pas besoin de compte

echo "🚀 Démarrage du tunnel SSH gratuit pour MySQL (port 8889)..."
echo ""
echo "📌 Utilisation de localhost.run (gratuit, via SSH)"
echo ""

# Arrêter les tunnels SSH existants
pkill -f "ssh.*ssh.localhost.run.*8889" 2>/dev/null
pkill -f "ssh.*localhost.run.*8889" 2>/dev/null
sleep 1

echo "✅ Création du tunnel TCP..."
echo "   (Cela peut prendre quelques secondes...)"
echo ""

# Créer le tunnel SSH vers localhost.run
# Format: ssh -R port_distant:localhost:port_local ssh.localhost.run
# localhost.run assigne automatiquement un port et affiche l'URL
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -R 8889:localhost:8889 ssh.localhost.run 2>&1 | tee /tmp/ssh_mysql_tunnel.log &
TUNNEL_PID=$!

# Attendre que le tunnel soit prêt
sleep 6

# Extraire l'URL du tunnel depuis les logs
TUNNEL_URL=$(grep -oE "[a-z0-9-]+\.localhost\.run" /tmp/ssh_mysql_tunnel.log 2>/dev/null | head -1)
TUNNEL_INFO=$(grep -E "connect to|localhost.run|ssh" /tmp/ssh_mysql_tunnel.log 2>/dev/null | head -5)

if [ -z "$TUNNEL_URL" ]; then
    echo "⏳ Tunnel en cours de création..."
    echo ""
    if [ ! -z "$TUNNEL_INFO" ]; then
        echo "$TUNNEL_INFO"
        echo ""
    fi
    echo "📋 Vérifiez les logs ci-dessus pour l'URL du tunnel"
    echo "   Ou consultez: cat /tmp/ssh_mysql_tunnel.log"
    echo ""
    echo "💡 Le format sera généralement:"
    echo "   [quelque-chose].localhost.run:8889"
    echo ""
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ TUNNEL CRÉÉ AVEC SUCCÈS!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 Configuration pour n8n MySQL:"
    echo ""
    echo "   Host: $TUNNEL_URL"
    echo "   Port: 8889"
    echo "   Database: ecocycle (ou votre nom de base)"
    echo "   User: root"
    echo "   Password: (vide ou 'root')"
    echo ""
    echo "🌐 URL complète: $TUNNEL_URL:8889"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

echo "⚠️  Le tunnel restera actif tant que ce script tourne"
echo "   Appuyez sur Ctrl+C pour arrêter le tunnel"
echo ""
echo "💡 Pour voir les logs en temps réel:"
echo "   tail -f /tmp/ssh_mysql_tunnel.log"
echo ""

# Garder le script actif
wait $TUNNEL_PID

