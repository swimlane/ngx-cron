// @ts-nocheck
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');
const pluginSecurity = require('eslint-plugin-security');
const swimlaneRules = require('./eslint/swimlane-rules');

const projectRuleOverrides = {
  '@angular-eslint/directive-class-suffix': 'off',
  '@angular-eslint/component-class-suffix': 'off',
  '@angular-eslint/no-input-rename': 'off',
  '@angular-eslint/no-output-native': 'off',
  '@angular-eslint/use-lifecycle-interface': 'off',
  '@angular-eslint/no-output-on-prefix': 'off',
  '@angular-eslint/prefer-standalone': 'off',
  '@angular-eslint/prefer-inject': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/consistent-type-imports': 'off',
  '@typescript-eslint/no-inferrable-types': 'off',
  '@typescript-eslint/no-duplicate-enum-values': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off'
};

module.exports = tseslint.config(
  {
    ignores: ['dist/**/*', 'cypress/**/*']
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      pluginSecurity.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
      eslintConfigPrettier
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './projects/swimlane/ngx-cron/tsconfig.json']
      }
    },
    processor: angular.processInlineTemplates,
    rules: {
      ...swimlaneRules,
      ...projectRuleOverrides
    }
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, eslintConfigPrettier],
    rules: {}
  }
);
