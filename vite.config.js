import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change '/windsor-dukes/' to match your GitHub repo name exactly
// e.g. if your repo is github.com/yourname/math-test → base: '/math-test/'
// For a custom domain or user/org site (yourname.github.io) → base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/windsor-dukes/',
})
