import { FilterPattern } from '@rollup/pluginutils';
import { PurgeCSS } from 'purgecss';
declare const _default: ({ css, output, include, exclude, }: {
    css: (Parameters<PurgeCSS['purge']>[0] & object)['css'];
    output: string;
    include?: string | RegExp | readonly (string | RegExp)[] | null | undefined;
    exclude?: string | RegExp | readonly (string | RegExp)[] | null | undefined;
}) => {
    name: "@luncheon/rollup-plugin-purgecss-keep-string-literals";
    buildStart(): void;
    transform(code: string, id: string): void;
    generateBundle(): Promise<void>;
};
export default _default;
