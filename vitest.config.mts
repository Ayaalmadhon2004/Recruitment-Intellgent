import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const src = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/design': src('./src/design'),
      '@/ui': src('./src/ui'),
      '@/patterns': src('./src/patterns'),
      '@/shell': src('./src/shell'),
      '@/domain': src('./src/domain'),
      '@/features': src('./src/features'),
      '@/fixtures': src('./tests/fixtures'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    passWithNoTests: true,
  },
});
