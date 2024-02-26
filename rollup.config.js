import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: 'dist/merchi.js', // Entry point of your library
  output: [
    {
      file: 'dist/output.cjs.js', // Output file for CommonJS (for Node) - specified in package.json
      format: 'cjs',
    },
    {
      file: 'dist/output.esm.js', // Output file for ES Module (for bundlers) - specified in package.json
      format: 'es',
    }
  ],
  plugins: [
    json(),
    resolve(), // Resolves node modules
    commonjs(), // Converts CommonJS modules to ES6
    babel({ babelHelpers: 'bundled' }) // Transpiles your code with Babel
  ]
};
