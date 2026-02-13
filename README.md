# Maulana Laundry - Web Application

A modern, high-performance Laundry Management System built with **Go (Fiber)** for the backend and **React (Vite)** for the frontend.

## 🚀 Project Overview
Maulana Laundry is a monorepo containing a full-stack solution for laundry business management. It features a sleek landing page, admin dashboard, user management, and transaction tracking.

## 📂 Project Structure
- **/backend**: Go Fiber API with GORM and PostgreSQL.
- **/frontend**: React + Vite application with Tailwind CSS and Shadcn UI.
- **/docs**: Detailed documentation and architecture overviews.
- **/.agent**: Custom AI Agent configurations (rules, skills, workflows).

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI, Framer Motion.
- **Backend**: Golang, Fiber v2, GORM, PostgreSQL, JWT.
- **Infrastructure**: Docker, Railway (Deployment).

## ⚡ Quick Start

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "web app laundry"
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   go run cmd/main.go
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📜 Documentation
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [API Reference](./docs/API.md)

## 🤝 Contributing
Please follow the [Conventional Commits](https://www.conventionalcommits.org/) standard for all pull requests.
