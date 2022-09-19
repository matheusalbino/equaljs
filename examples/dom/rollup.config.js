import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';

const environment = process.env.BUILD ?? 'development';
const isDevelopment = environment === 'development';

export default defineConfig({
  input: ['src/main.tsx'],
  output: {
    sourcemap: true,
    dir: 'build',
    format: 'iife',
    chunkFileNames: '[name].js',
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(environment),
      },
    }),
    commonjs(),
    nodeResolve({ browser: true, preferBuiltins: true }),
    postcss(),
    typescript(),
    copy({
      targets: [{ src: 'src/assets/', dest: 'build' }],
    }),
    html(),
    isDevelopment &&
      serve({
        port: 3000,
        contentBase: ['build'],
      }),
    isDevelopment && livereload(),
  ],
});
