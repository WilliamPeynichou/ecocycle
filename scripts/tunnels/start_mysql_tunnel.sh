#!/bin/bash

# Script pour créer un tunnel TCP gratuit vers MySQL MAMP
# Utilise localtunnel via npx (gratuit, pas besoin de compte)

echo "🚀 Démarrage du tunnel TCP gratuit pour MySQL (port 8889)..."
echo ""
echo "📌 Utilisation de localtunnel (gratuit, pas de compte requis)"
echo ""

# Arrêter les tunnels existants sur le port 8889
pkill -f "lt.*8889" 2>/dev/null
pkill -f "localtunnel.*8889" 2>/dev/null
sleep 1

echo "✅ Création du tunnel..."
echo "   (Cela peut prendre quelques secondes...)"
echo ""

# Démarrer localtunnel avec npx
# Note: localtunnel crée une URL HTTPS, mais on peut l'utiliser pour TCP
# En fait, localtunnel ne supporte que HTTP/HTTPS, pas TCP natif

# Pour MySQL TCP, on va utiliser bore.pub ou une autre solution
# Mais d'abord, essayons avec cloudflared qui est gratuit et supporte TCP

# Vérifier si cloudflared est disponible
if command -v cloudflared &> /dev/null; then
    echo "✅ Utilisation de Cloudflare Tunnel (cloudflared)..."
    echo ""
    cloudflared tunnel --url tcp://localhost:8889 &
    TUNNEL_PID=$!
    sleep 5
    
    echo "✅ Tunnel Cloudflare créé!"
    echo "   Vérifiez l'URL ci-dessus"
    
elif command -v npx &> /dev/null; then
    echo "⚠️  localtunnel ne supporte que HTTP/HTTPS, pas TCP MySQL"
    echo ""
    echo "💡 Solution alternative: Utiliser bore.pub"
    echo ""
    echo "Pour installer bore (gratuit, open source):"
    echo "  1. Installez Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo "  2. Installez bore: cargo install bore-cli"
    echo "  3. Créez le tunnel: bore local 8889 --to bore.pub"
    echo ""
    echo "Ou utilisez ce script qui installe bore automatiquement..."
    
    # Vérifier si Rust est installé
    if command -v cargo &> /dev/null; then
        echo ""
        echo "🔧 Installation de bore..."
        cargo install bore-cli 2>&1 | tail -5
        echo ""
        echo "✅ bore installé! Création du tunnel..."
        bore local 8889 --to bore.pub &
        TUNNEL_PID=$!
        sleep 3
        echo ""
        echo "✅ Tunnel créé! Vérifiez l'URL ci-dessus"
    else
        echo ""
        echo "❌ Rust n'est pas installé"
        echo ""
        echo "📋 Solutions alternatives:"
        echo ""
        echo "Option 1: Installer bore manuellement"
        echo "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
        echo "  source ~/.cargo/env"
        echo "  cargo install bore-cli"
        echo "  bore local 8889 --to bore.pub"
        echo ""
        echo "Option 2: Utiliser serveo.net (SSH tunnel)"
        echo "  ssh -R 0:localhost:8889 serveo.net"
        echo ""
        echo "Option 3: Utiliser un VPS ou héberger MySQL dans le cloud"
        exit 1
    fi
else
    echo "❌ npx n'est pas disponible"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Une fois l'URL obtenue, configurez n8n avec:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   Host: [adresse du tunnel]"
echo "   Port: [port du tunnel]"
echo "   Database: ecocycle"
echo "   User: root"
echo "   Password: (vide ou 'root')"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  Le tunnel restera actif tant que ce terminal est ouvert"
echo "   Appuyez sur Ctrl+C pour arrêter"
echo ""

wait $TUNNEL_PID 2>/dev/null || wait

