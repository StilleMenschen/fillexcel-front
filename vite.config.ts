/// <reference lib="es2018.regexp" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";
import legacy from "@vitejs/plugin-legacy";
// 按组件的目录名称分包
const moduleMatch = new RegExp(/[\\/]src[\\/](components|http|routers|store)[\\/]/i);

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:4200",
                rewrite(path) {
                    return path.replace(/^\/api/, "");
                }
            }
        }
    },
    plugins: [
        react(),
        legacy({
            targets: "chrome >= 78, not dead, > 0.3%, Firefox ESR"
        }),
        viteCompression({
            // 超过 240 KiB 压缩
            threshold: 245760
        })
    ],
    build: {
        // target: "es2015",
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // 合并外部依赖到同一个文件
                    if (/node_modules[\\/]@?ant/.test(id)) {
                        return "vendor-ui";
                    }
                    if (/node_modules[\\/]rc-/.test(id)) {
                        return "vendor-ui-rc";
                    }
                    if (/node_modules/.test(id)) {
                        return "vendor";
                    }
                    // 按组件的目录名称分包
                    if (moduleMatch.test(id)) {
                        return "app";
                    }
                }
            }
        }
    }
});
