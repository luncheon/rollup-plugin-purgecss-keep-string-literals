"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluginutils_1 = require("@rollup/pluginutils");
const acorn = require("acorn");
const fs = require("fs");
const path = require("path");
const purgecss_1 = require("purgecss");
const flatSet = (iterable) => {
    const set = new Set();
    for (const items of iterable) {
        for (const item of items) {
            set.add(item);
        }
    }
    return set;
};
const mapGetOrSet = (map, key, generator) => {
    let value = map.get(key);
    if (!value) {
        value = generator(key);
        map.set(key, value);
    }
    return value;
};
exports.default = ({ css, output, include, exclude, }) => {
    const filter = pluginutils_1.createFilter(include, exclude);
    const purge = new purgecss_1.PurgeCSS();
    const moduleTokensMap = new Map();
    return {
        name: '@luncheon/rollup-plugin-purgecss-keep-string-literals',
        transform(code, id) {
            if (!filter(id)) {
                return;
            }
            const tokens = mapGetOrSet(moduleTokensMap, id, () => new Set());
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
                safelist: [...flatSet(moduleTokensMap.values())],
                keyframes: true,
                variables: true,
            });
            await fs.promises.mkdir(path.dirname(output), { recursive: true });
            await fs.promises.writeFile(output, purged[0].css, 'utf8');
        },
    };
};
