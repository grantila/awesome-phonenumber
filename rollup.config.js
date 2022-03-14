import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: './index.js',
    output: {
      file: './build/index-esm.js',
      format: 'es',
      interop: 'auto',
      exports: 'named',
    },
    plugins: [commonjs()],
  },
];
