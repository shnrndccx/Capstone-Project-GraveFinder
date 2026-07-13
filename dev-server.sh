#!/bin/bash

# GraveFinder Development Server Launcher for macOS and Linux
# This script starts the development server on Unix-like systems

echo ""
echo "🌍 GraveFinder Development Server ($(uname -s))"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo ""
    echo "Install Node.js using one of these methods:"
    echo ""
    echo "macOS (using Homebrew):"
    echo "  brew install node"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt update && sudo apt install nodejs npm"
    echo ""
    echo "Or download from: https://nodejs.org/"
    exit 1
fi

# Display system info
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "npm should have been installed with Node.js"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

echo ""
echo "⏳ Starting development server on http://localhost:8000"
echo "📂 Serving from: $(pwd)"
echo ""
echo "💡 Tips:"
echo "   • Open http://localhost:8000 in your browser"
echo "   • Press Ctrl+C to stop the server"
echo "   • Files are auto-reloaded (refresh your browser)"
echo ""

# Start the development server
npm run dev
