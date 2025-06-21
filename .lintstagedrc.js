export default {
  '**/*.{ts,tsx,js,jsx,cjs,mjs,json,jsonc}': [
    'biome check --no-errors-on-unmatched --write',
  ],
  '**/*.{md,yml,yaml}': ['prettier --cache --write'],
}
