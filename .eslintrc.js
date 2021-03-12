module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        "object-shorthand": ["error", "always", { "ignoreConstructors": true }],
        "quote-props": ["error", "as-needed"],
        "prefer-object-spread": "error",
        "array-callback-return": "error",
        "prefer-destructuring": ["error", {
            "array": true,
            "object": true
          }, {
            "enforceForRenamedProperties": false
          }],
          "quotes": ["error", "single", { "allowTemplateLiterals": true }],
          "func-style": ["error", "declaration", { "allowArrowFunctions": true }],
          "no-loop-func": "error",
          "prefer-rest-params": "error",
          "default-param-last": ["error"],
          "prefer-spread": "error",
          "no-confusing-arrow": ["error", {"allowParens": true}],
          "no-useless-constructor": "error",
          "class-methods-use-this": "error",
          "no-duplicate-imports": ["error", { "includeExports": true }],
          "no-iterator": "error",
          "dot-notation": "error",
          "no-undef": "error",
          "prefer-const": "error",
          "one-var": ["error", "always"],
          "no-unused-vars": "error",
          "no-unused-vars": "error",
          "no-case-declarations": "error",
          "no-unneeded-ternary": "error",
          "no-mixed-operators": "error",
          "brace-style": "error",
          "no-else-return": "error",
          "indent": ["error", 2],
          "space-before-blocks": "error",
          "ignoreChainWithDepth": 2,
          "no-whitespace-before-property": "error",
          "padded-blocks": ["error", "always"],
          "no-multiple-empty-lines": "error",
          "space-in-parens": ["error", "never"],
          "array-bracket-spacing": ["error", "never"],
          "comma-spacing": ["error", { "before": false, "after": true }],
          "no-new-wrappers": "error",
          "id-length": "error",
          "camelcase": "error",
    }
};
