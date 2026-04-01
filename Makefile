.PHONY: help install dev build start lint test clean deploy

help:
	@echo "Backrooms Game - Available commands:"
	@echo ""
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Start development server (http://localhost:3000)"
	@echo "  make build        - Build for production"
	@echo "  make start        - Start production server"
	@echo "  make lint         - Run ESLint"
	@echo "  make clean        - Remove build artifacts and cache"
	@echo "  make deploy       - Deploy to Vercel (requires vercel CLI)"
	@echo ""

install:
	@echo "📦 Installing dependencies..."
	npm install

dev:
	@echo "🎮 Starting development server..."
	npm run dev

build:
	@echo "🏗️  Building for production..."
	npm run build

start: build
	@echo "🚀 Starting production server..."
	npm start

lint:
	@echo "🔍 Running ESLint..."
	npm run lint

test:
	@echo "🧪 Running tests..."
	@echo "Tests not yet configured"

clean:
	@echo "🧹 Cleaning up..."
	rm -rf .next
	rm -rf out
	rm -rf build
	rm -rf dist
	npm cache clean --force
	@echo "✅ Clean complete"

deploy:
	@echo "🌐 Deploying to Vercel..."
	@command -v vercel >/dev/null 2>&1 || { echo "❌ Vercel CLI not found. Install it with: npm install -g vercel"; exit 1; }
	vercel

.DEFAULT_GOAL := help
