import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    ignores: [
      '.claude/**',
      '.next/**',
      'storybook-static/**',
      'design-reference/**',
      'coverage/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
