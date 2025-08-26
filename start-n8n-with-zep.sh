#!/bin/bash

# Start n8n with Zep nodes
echo "🚀 Starting n8n with Zep nodes..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get script directory and navigate to it
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
cd "$SCRIPT_DIR"

# Define all expected node files
EXPECTED_NODES=(
    "dist/nodes/Zep/Zep.node.js"
    "dist/nodes/ZepAiTool/ZepAiTool.node.js"
)

# Step 1: Ensure all nodes are built
print_info "Checking if all nodes are built..."
NEEDS_BUILD=false
for node_file in "${EXPECTED_NODES[@]}"; do
    if [ ! -f "$node_file" ]; then
        print_warning "Missing: $node_file"
        NEEDS_BUILD=true
    fi
done

if [ "$NEEDS_BUILD" = true ]; then
    print_info "Building nodes..."
    npm run build
    if [ $? -ne 0 ]; then
        print_error "Build failed!"
        exit 1
    fi
    print_status "All nodes built successfully"
else
    print_status "All nodes are already built"
fi

# Step 2: Clear n8n cache to ensure fresh load
print_info "Clearing n8n cache..."
rm -rf ~/.n8n/cache ~/.n8n/custom 2>/dev/null || true
print_status "Cache and custom directory cleared"

# Step 3: Setup clean custom directory structure
print_info "Setting up custom directory structure..."
mkdir -p ~/.n8n/custom/dist

# Copy files with proper error handling
print_info "Copying node files..."
if cp -r "$SCRIPT_DIR/dist"/* ~/.n8n/custom/dist/ 2>/dev/null; then
    print_status "Node files copied successfully"
else
    print_error "Failed to copy dist files"
    exit 1
fi

if cp "$SCRIPT_DIR/package.json" ~/.n8n/custom/ 2>/dev/null; then
    print_status "package.json copied successfully"
else
    print_error "Failed to copy package.json"
    exit 1
fi

if cp "$SCRIPT_DIR/index.js" ~/.n8n/custom/ 2>/dev/null; then
    print_status "index.js copied successfully"
else
    print_error "Failed to copy index.js"
    exit 1
fi

# Verify all expected nodes are in place
print_info "Verifying all nodes are properly installed..."
ALL_NODES_PRESENT=true
for node_file in "${EXPECTED_NODES[@]}"; do
    custom_path="$HOME/.n8n/custom/${node_file}"
    if [ ! -f "$custom_path" ]; then
        print_error "Missing in custom directory: $custom_path"
        ALL_NODES_PRESENT=false
    fi
done

if [ "$ALL_NODES_PRESENT" = true ]; then
    print_status "All 2 Zep nodes verified in custom directory"
else
    print_error "Some nodes are missing from custom directory"
    exit 1
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

# Fix deprecation warnings
export DB_SQLITE_POOL_SIZE=10
export N8N_RUNNERS_ENABLED=true
export N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true

# Suppress LangChain upgrade messages (optional)
export N8N_LANGCHAIN_HIDE_UPGRADE_MESSAGES=true

echo ""
print_status "Setup complete! Starting n8n..."
print_info "Environment configured to suppress deprecation warnings"
echo ""
echo "🌐 n8n will be available at: http://localhost:5678"
echo "🔑 First time setup will require creating an admin account"
echo ""
echo "📋 Available Zep nodes (2 total):"
echo "   • Zep: Complete Zep v3 API access (Users, Threads, Graphs, etc.)"
echo "   • ZepAiTool: AI Agent integration for memory & knowledge"
echo ""
echo "🔧 Main operations available:"
echo "   • User & Thread Management"
echo "   • Memory Context (Add/Get/Search)"
echo "   • Knowledge Graph Operations"
echo "   • Session & Chat Management"
echo "   • Development Testing & Debugging"
echo ""
print_warning "If Zep nodes don't appear:"
print_warning "1. Refresh the browser page"
print_warning "2. Check browser console for errors"
print_warning "3. Clear browser cache and reload"
print_warning "4. Restart the script: Ctrl+C then npm run n8n:dev"
echo ""
echo "Press Ctrl+C to stop n8n"
echo ""

n8n start
