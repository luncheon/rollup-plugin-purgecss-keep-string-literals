"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluginutils_1 = require("@rollup/pluginutils");
const acorn = require("acorn");
const fs = require("fs");
const purgecss_1 = require("purgecss");
exports.default = ({ css, output, include, exclude, }) => {
    const filter = pluginutils_1.createFilter(include, exclude);
    const purge = new purgecss_1.PurgeCSS();
    let tokens;
    return {
        name: '@luncheon/rollup-plugin-purgecss-keep-string-literals',
        buildStart() {
            tokens = new Set();
        },
        transform(code, id) {
            if (!filter(id)) {
                return;
            }
            for (const token of acorn.tokenizer(code, { ecmaVersion: 'latest' })) {
                if (token.type.label === 'string' || token.type.label === 'template') {
                    for (const s of token.value.split(/\s+/)) {
                        tokens.add(s);
                    }
                }
            }
        },
        async generateBundle() {
            const purged = await purge.purge({
                css,
                content: [],
                safelist: [...tokens],
                keyframes: true,
                variables: true,
            });
            await fs.promises.writeFile(output, purged[0].css, 'utf8');
        },
    };
};
