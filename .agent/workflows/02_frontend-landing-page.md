---
description: Create a modern, responsive landing page for Maulana Laundry using React, Vite, Tailwind, and Shadcn UI.
---

# 02 Frontend Landing Page (Maulana Laundry)

This workflow sets up a high-performance, PWA-ready landing page with a clean Blue/White theme, Floating WhatsApp, and animations.

## 1. Initialize Vite Project
// turbo
Initialize the React project with Vite and TypeScript.
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

## 2. Install Tailwind CSS & Dependencies
// turbo
Install Tailwind, Framer Motion (for animations), and Lucide React (icons).
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion lucide-react react-helmet-async clsx tailwind-merge
npm install vite-plugin-pwa
```

## 3. Configure Tailwind & Theme (Blue/White)
Configure `tailwind.config.js` and `index.css` for the "Clean Blue" theme.

### 3.1 Tailwind Config
Update `frontend/tailwind.config.js`.
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0ea5e9", // Sky Blue 500
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f0f9ff", // Sky Blue 50
          foreground: "#0284c7",
        },
        background: "#ffffff",
        foreground: "#0f172a", // Slate 900
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
```

### 3.2 Global CSS
Update `frontend/src/index.css`.
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

## 4. Setup Shadcn UI (Manual/Lightweight)
Since we want a quick setup, we'll manually add the standard `utils.ts` and button component if needed, or initialize full shadcn.
// turbo
```bash
cd frontend
npx shadcn-ui@latest init -y
```

## 5. Implement Components

### 5.1 Floating WhatsApp
Create `frontend/src/components/FloatingWA.tsx`.
```tsx
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const FloatingWA = () => {
  return (
    <motion.a
      href="https://wa.me/6281316790080"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition-colors"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Chat WhatsApp"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
};
```

### 5.2 Navbar & Hero
Create `frontend/src/components/Hero.tsx`.
```tsx
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 text-center z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-blue-900 mb-6"
            >
              Maulana Laundry
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-blue-600 mb-8"
            >
              Layanan Laundry Premium di Bogor. Bersih, Wangi, Rapi.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://wa.me/6281316790080', '_blank')}
              className="bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Pesan Sekarang
            </motion.button>
        </div>
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        </div>
    </section>
  );
};
```

## 6. PWA Setup
Update `frontend/vite.config.ts`.
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Maulana Laundry',
        short_name: 'MaulanaLaundry',
        description: 'Layanan Laundry Terbaik di Bogor',
        theme_color: '#0ea5e9',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## 7. Main App Assembly
Update `frontend/src/App.tsx`.
```tsx
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Hero } from './components/Hero';
import { FloatingWA } from './components/FloatingWA';

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-white font-sans text-foreground">
        <Helmet>
          <title>Maulana Laundry | Jasa Laundry Bogor</title>
          <meta name="description" content="Jasa laundry kiloan dan satuan terbaik di Bogor. Hubungi 081316790080. Layanan antar jemput tersedia." />
          <meta name="theme-color" content="#0ea5e9" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Helmet>
        
        <Hero />
        
        {/* Placeholder for Services Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-8">Layanan Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Cuci Komplit', 'Cuci Kering', 'Satuan'].map((service) => (
                <div key={service} className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2 text-primary">{service}</h3>
                  <p className="text-gray-600">Proses cepat dan higienis.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FloatingWA />
      </div>
    </HelmetProvider>
  )
}

export default App
```

## 8. Development
// turbo
Run the frontend development server.
```bash
cd frontend
npm run dev
```
