import { createFilter } from '@rollup/pluginutils';
import * as acorn from 'acorn';
import * as fs from 'fs';
import { PurgeCSS } from 'purgecss';
export default ({ css, output, include, exclude, }) => {
    const filter = createFilter(include, exclude);
    const purge = new PurgeCSS();
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
