#!/bin/bash

# GunaasoNepal - Quick Setup Script
# This script helps set up the development environment

set -e

echo "========================================="
echo "  GunaasoNepal - Quick Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js 20 or higher is required${NC}"
    echo "Current version: $(node -v)"
    echo "Please upgrade Node.js: https://nodejs.org/"
    exit 1
else
    echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"
fi

# Check if .env.local exists
echo ""
echo "Checking environment configuration..."
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: You need to configure .env.local with your Supabase credentials${NC}"
    echo ""
    echo "Required variables:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "Get these from: https://app.supabase.com/project/_/settings/api"
    echo ""
    read -p "Press Enter when you've updated .env.local..."
else
    echo -e "${GREEN}✅ .env.local exists${NC}"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Check if database is set up
echo ""
echo "========================================="
echo "  Database Setup Instructions"
echo "========================================="
echo ""
echo "Next steps to complete setup:"
echo ""
echo "1. Go to: https://app.supabase.com"
echo "2. Create a new project (or use existing)"
echo "3. Go to SQL Editor"
echo "4. Copy contents of: supabase/schema.sql"
echo "5. Execute the SQL script"
echo "6. Go to Storage → Create bucket"
echo "   - Name: evidence"
echo "   - Public: Yes"
echo ""
echo "For detailed instructions, see:"
echo "  - supabase/setup-instructions.sql"
echo "  - BACKEND_SETUP.md"
echo ""

# Offer to open documentation
read -p "Would you like to open the setup documentation? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open BACKEND_SETUP.md
    elif command -v open &> /dev/null; then
        open BACKEND_SETUP.md
    else
        echo "Please open BACKEND_SETUP.md manually"
    fi
fi

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Configure database (see instructions above)"
echo "2. Update .env.local with your Supabase credentials"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "  - README.md           - Project overview"
echo "  - BACKEND_SETUP.md    - Backend setup guide"
echo "  - API_TESTING.md      - API testing examples"
echo "  - ARCHITECTURE.md     - Technical architecture"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
