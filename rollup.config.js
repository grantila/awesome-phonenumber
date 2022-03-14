import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: './index.js',
    output: {
      file: './index-esm.js',
      format: 'es',
      exports: 'auto',
    },
    plugins: [commonjs()],
  },
];
