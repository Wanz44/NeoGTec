/**
 * 🎨 Fichier : /tailwind.config.ts
 * 🛠️ Configuration : Système d'identité de marque NeoGTec et intégration Tremor UI
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Thème principal NeoGTec (Zéro bleu générique)
        neogtec: {
          background: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          foreground: '#0F172A',
          primary: '#00A86B',         // Vert émeraude vibrant
          primaryHover: '#007D4C',    // Vert sapin
          destructive: '#EF4444',     // Rouge alertes
          success: '#22C55E',         // Vert clair badges
          muted: '#F1F5F9'
        },
        // Configuration de la palette chromatique Tremor UI
        tremor: {
          brand: {
            faint: '#00A86B0A',
            muted: '#00A86B33',
            subtle: '#00A86B66',
            DEFAULT: '#00A86B', // NeoGTec emerald primary
            emphasis: '#007D4C'
          },
          background: {
            faint: '#F8FAFC',
            muted: '#F1F5F9',
            subtle: '#E2E8F0',
            DEFAULT: '#FFFFFF', // Light mode bg cards
            emphasis: '#0F172A'
          },
          border: {
            DEFAULT: '#E2E8F0'
          },
          ring: {
            DEFAULT: '#00A86B'
          },
          content: {
            subtle: '#64748B',
            DEFAULT: '#0F172A',
            emphasis: '#010101',
            strong: '#111111'
          }
        }
      },
      boxShadow: {
        // Shadows compatibles avec les standards Windows 11 et fluent web
        suttle: '0 2px 8px rgba(0, 0, 0, 0.04)',
        fluent: '0 8px 32px rgba(0, 0, 0, 0.06)'
      }
    }
  },
  plugins: []
};

export default config;
