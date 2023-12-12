import { defineConfig } from "rollup"
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
    input: "src/index.ts",
    output: {
        dir: "dist",
        format: "es",
    },
    plugins: [
        typescript({
            tsconfig: "tsconfig.json",
            check: false,
        }),
        commonjs()
    ]
})