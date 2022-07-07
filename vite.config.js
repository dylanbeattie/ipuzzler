import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';


export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
    return defineConfig({
        build: {
            formats: ['es'],
            lib: {
                entry: path.resolve(__dirname, 'js/ipuzzler.js'),
                name: 'iPuzzler',
                fileName: (format) => `js/ipuzzler-${process.env.VITE_IPUZZLER_BUILD_VERSION}${format == 'es' ? '' : '.' + format}.js`
            }
        },
        test: {
            environment: 'jsdom'
        }        
    });
}