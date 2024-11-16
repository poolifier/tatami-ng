export default {
  '**/*.{ts,tsx,js,jsx,cjs,mjs,json,jsonc}': [
    'biome check --no-errors-on-unmatched --apply',
  ],
  '**/*.{md,yml,yaml}': ['prettier --cache --write'],
}
