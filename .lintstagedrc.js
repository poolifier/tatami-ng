export default {
  '**/*.{ts,tsx,js,jsx,cjs,mjs,json,jsonc}': ['biome check --apply'],
  '**/*.{md,yml,yaml}': ['prettier --cache --write'],
}
