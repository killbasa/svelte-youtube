module.exports = {
	root: true,
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'plugin:prettier/recommended'
	],
	plugins: ['@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: './tsconfig.eslint.json',
		extraFileExtensions: ['.svelte'],
		ecmaVersion: 2020,
		sourceType: 'module',
		warnOnUnsupportedTypeScriptVersion: false
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	env: {
		es6: true,
		browser: true,
		node: true
	},
	rules: {}
};
