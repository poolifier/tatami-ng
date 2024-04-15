import { existsSync, rmSync } from 'node:fs';
import { build } from 'bun';

export const entryPoints = ['./src/index.mjs'];

export const baseBuildDir = './dist';
export const browserBuildDir = `${baseBuildDir}/browser`;

console.time('Browser build time');
if (existsSync(browserBuildDir)) {
  rmSync(browserBuildDir, { recursive: true });
}

await build({
  entrypoints: entryPoints,
  outdir: browserBuildDir,
  target: 'browser',
  minify: true,
  sourcemap: 'external',
});
console.timeEnd('Browser build time');
