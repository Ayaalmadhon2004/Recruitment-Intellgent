/** Layer rules from docs/ARCHITECTURE.md. Imports point downward only. */
const forbid = (name, from, to, comment) => ({
  name,
  comment,
  severity: 'error',
  from: { path: from },
  to: { path: to },
});

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    forbid(
      'design-imports-nothing',
      '^src/design/',
      '^src/(ui|patterns|shell|domain|features|app)/',
      'design is the lowest layer and imports nothing.',
    ),
    forbid(
      'ui-only-design',
      '^src/ui/',
      '^src/(patterns|shell|domain|features|app)/',
      'ui may import design only.',
    ),
    forbid(
      'patterns-no-upward',
      '^src/patterns/',
      '^src/(shell|features|app)/',
      'patterns may import ui, design and domain types only.',
    ),
    forbid(
      'patterns-domain-types-only',
      '^src/patterns/',
      '^src/domain/(config|scoring|copy)/',
      'patterns may use domain types only, never config, scoring or copy.',
    ),
    forbid(
      'shell-no-upward',
      '^src/shell/',
      '^src/(patterns|features|app)/',
      'shell may import ui and design (and domain copy keys) only.',
    ),
    forbid(
      'shell-no-domain-logic',
      '^src/shell/',
      '^src/domain/(config|scoring|types)/',
      'shell may read domain copy only.',
    ),
    forbid(
      'domain-pure',
      '^src/domain/',
      '^src/(design|ui|patterns|shell|features|app)/',
      'domain is pure TypeScript and imports nothing from the UI layers.',
    ),
    {
      name: 'domain-no-react',
      comment: 'domain must not depend on React, Next or any UI library.',
      severity: 'error',
      from: { path: '^src/domain/' },
      to: { path: 'node_modules/(react|react-dom|next)/' },
    },
    forbid(
      'features-no-app',
      '^src/features/',
      '^src/app/',
      'features never import from app routes.',
    ),
    {
      name: 'features-through-index-only',
      comment: 'A feature may import another feature only through its index.ts.',
      severity: 'error',
      from: { path: '^src/features/([^/]+)/' },
      to: {
        path: '^src/features/([^/]+)/(?!index\\.ts$)',
        pathNot: '^src/features/$1/',
      },
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    tsConfig: { fileName: 'tsconfig.json' },
    doNotFollow: { path: 'node_modules' },
    includeOnly: '^src/|node_modules/(react|react-dom|next)/',
    exclude: { path: '\\.(test|stories)\\.tsx?$' },
    moduleSystems: ['es6', 'cjs'],
  },
};
