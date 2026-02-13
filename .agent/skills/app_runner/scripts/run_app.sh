#!/bin/bash

# Configuration
BACKEND_PORT=8080
FRONTEND_PORT=5173

echo "🚀 Starting Maulana Laundry Application..."

# 1. Kill existing processes on ports
echo "🔍 Checking for existing processes on ports $BACKEND_PORT and $FRONTEND_PORT..."

BE_PID=$(lsof -ti:$BACKEND_PORT)
if [ ! -z "$BE_PID" ]; then
    echo "🔪 Killing process $BE_PID on port $BACKEND_PORT"
    kill -9 $BE_PID
fi

FE_PID=$(lsof -ti:$FRONTEND_PORT)
if [ ! -z "$FE_PID" ]; then
    echo "🔪 Killing process $FE_PID on port $FRONTEND_PORT"
    kill -9 $FE_PID
fi

# 2. Start Backend
echo "📦 Starting Backend (Fiber)..."
cd backend
go run cmd/main.go & 
BACKEND_PROCESS=$!
echo "✅ Backend started with PID $BACKEND_PROCESS"

# 3. Start Frontend
echo "💻 Starting Frontend (Vite)..."
cd ../frontend
npm run dev &
FRONTEND_PROCESS=$!
echo "✅ Frontend started with PID $FRONTEND_PROCESS"

echo "------------------------------------------------"
echo "🌟 Application is running!"
echo "📍 Backend: http://localhost:$BACKEND_PORT/api"
echo "📍 Frontend: http://localhost:$FRONTEND_PORT"
echo "------------------------------------------------"
echo "Use 'kill $BACKEND_PROCESS $FRONTEND_PROCESS' to stop apps."

# Keep script running to monitor logs if needed, or just exit if backgrounded
wait
