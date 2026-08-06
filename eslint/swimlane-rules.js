'use strict';

/** Behavioral rules from archived @swimlane/eslint-config@2 (stylistic rules omitted — Prettier owns those). */
module.exports = {
  'no-console': 'error',
  'no-alert': 'error',
  'no-debugger': 'error',
  'no-undef': 'off',
  'no-shadow': 'off',
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/naming-convention': ['error', { selector: 'enumMember', format: null }],
  'security/detect-object-injection': 'off',
  'security/detect-non-literal-fs-filename': 'off'
};
