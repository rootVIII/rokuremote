module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        indent: ['error', 4],
        'no-multi-assign': ['error', { ignoreNonDeclaration: true }],
        'no-plusplus': 'off',
        'func-names': ['error', 'never'],
        'no-multiple-empty-lines': 'error',
        'space-before-function-paren': ['error', 'never'],
        'no-console': 'off',
        'import/prefer-default-export': 'off',
        'no-var': 0,
        'no-useless-escape': 0,
        'no-cond-assign': 0,
        'prefer-const': 0,
        'no-bitwise': 0,
        'no-param-reassign': 0,
    },
};
