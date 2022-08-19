import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

export default defineConfig({
  input: ['src/index.ts', 'src/jsx-runtime.ts', 'src/jsx-dev-runtime.ts'],
  output: [
    {
      strict: false,
      esModule: true,
      sourcemap: true,
      dir: 'lib/esm',
      format: 'esm',
      chunkFileNames: '[name].js',
    },
    {
      strict: false,
      esModule: false,
      sourcemap: true,
      dir: 'lib/cjs',
      format: 'cjs',
      chunkFileNames: '[name].js',
    },
  ],
  plugins: [
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
});
