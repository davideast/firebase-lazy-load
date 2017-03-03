const rollup = require('rollup');
const fs = require('fs');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const psize = require('pretty-size');
const gzipSize = require('gzip-size');
const UglifyJS = require("uglify-js");

rollup.rollup({
  entry: 'module/index.js'
}).then((bundle) => {
  const result = bundle.generate({
    format: 'umd',
    moduleName: 'firebaseLazy'
  });
  return bundle.write({
    format: 'umd',
    dest: 'dist/index.js',
    moduleName: 'firebaseLazy'
  });
}).then(_ => {
  const result = UglifyJS.minify('dist/index.js');
  fs.writeFileSync('dist/index.min.js', result.code);
  const file = fs.readFileSync('dist/index.min.js');
  const bytes = gzipSize.sync(file);
  console.log(`${psize(bytes, true)} gzipped`);
});
