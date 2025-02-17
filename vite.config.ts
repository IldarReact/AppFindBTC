import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            include: ['buffer', 'crypto', 'util', 'stream'],
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    define: {
        'process.env': {},
        'global': {},
    },
    build: {
        sourcemap: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'firebase/app', 'firebase/firestore'],
                    web3: ['@ton/ton'],
                },
            },
        },
    },
    optimizeDeps: {
        include: ['@ton/ton', 'firebase/app', 'firebase/firestore'],
        esbuildOptions: {
            target: 'esnext',
        },
    },
});