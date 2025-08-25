#!/bin/bash

# Start n8n with Zep node
echo "🚀 Starting n8n with Zep node..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Get script directory and navigate to it
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
cd "$SCRIPT_DIR"

# Step 1: Ensure the node is built
if [ ! -f "dist/nodes/Zep/Zep.node.js" ]; then
    print_warning "Zep node not built. Building now..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
    print_status "Node built successfully"
fi

# Step 2: Clear n8n cache to ensure fresh load
print_info "Clearing n8n cache..."
rm -rf ~/.n8n/cache 2>/dev/null || true
print_status "Cache cleared"

# Step 3: Copy node to custom directory (correct approach for n8n)
print_info "Installing Zep node to custom directory..."
mkdir -p ~/.n8n/custom

# Copy only essential files to custom directory (avoid node_modules, etc.)
cp -r "$SCRIPT_DIR/dist"/* ~/.n8n/custom/dist/ 2>/dev/null || true
cp "$SCRIPT_DIR/package.json" ~/.n8n/custom/ 2>/dev/null || true  
cp "$SCRIPT_DIR/index.js" ~/.n8n/custom/ 2>/dev/null || true

# Make sure the essential files are there
if [ -f ~/.n8n/custom/dist/nodes/Zep/Zep.node.js ] && [ -f ~/.n8n/custom/package.json ]; then
    print_status "Zep node copied to custom directory"
else
    print_warning "Some files may not have copied correctly, trying selective copy..."
    mkdir -p ~/.n8n/custom/dist
    cp -r "$SCRIPT_DIR/dist"/* ~/.n8n/custom/dist/ 2>/dev/null || true
    cp "$SCRIPT_DIR/package.json" ~/.n8n/custom/ 2>/dev/null || true
    cp "$SCRIPT_DIR/index.js" ~/.n8n/custom/ 2>/dev/null || true
    
    if [ -f ~/.n8n/custom/dist/nodes/Zep/Zep.node.js ]; then
        print_status "Zep node files copied successfully"
    else
        print_error "Failed to copy node files"
        exit 1
    fi
fi

# Step 4: Stop any existing n8n instances
print_info "Stopping any existing n8n instances..."
pkill -f "n8n" 2>/dev/null || true
sleep 2

# Step 5: Set environment variables for better development
export N8N_DIAGNOSTICS_ENABLED=false
export N8N_VERSION_NOTIFICATIONS_ENABLED=false
export N8N_TEMPLATES_ENABLED=true
export N8N_ONBOARDING_FLOW_DISABLED=false

# Critical: Set custom extensions path for n8n to find our node
export N8N_CUSTOM_EXTENSIONS="$HOME/.n8n/custom"

# Enable debug logging to help diagnose issues
export N8N_LOG_LEVEL=info
export NODE_ENV=development

echo ""
print_status "Setup complete! Starting n8n..."
echo ""
echo "🌐 n8n will be available at: http://localhost:5678"
echo "🔑 First time setup will require creating an admin account"
echo ""
echo "📋 Available Zep operations:"
echo "   • User Management (CRUD operations)"
echo "   • Memory Management (sessions, messages)"
echo "   • Session Operations (list, search, classify)"
echo "   • Message Operations (search, update, rate)"
echo "   • Document Management (collections, documents)" 
echo ""
print_warning "If Zep node doesn't appear:"
print_warning "1. Refresh the browser page"
print_warning "2. Check browser console for errors"
print_warning "3. Try running: npm run dev:restart"
echo ""
echo "Press Ctrl+C to stop n8n"
echo ""

n8n start
