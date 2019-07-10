module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "globals": {},
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "script"
    },
    "rules": {
        "no-console": ["error", { allow: ["info", "warn", "error"] }],
        "indent": ["error", 2],
        "quotes": ["error", "single"],
        "eol-last": "error"
    }
};
