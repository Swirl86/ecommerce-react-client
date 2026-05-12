import path from "path";

export const alias = {
    "@": path.resolve(__dirname, "./src"),
    "@components": path.resolve(__dirname, "./src/components"),
    "@typography": path.resolve(__dirname, "./src/components/typography"),
    "@sidebar": path.resolve(__dirname, "./src/components/sidebar"),
    "@layout": path.resolve(__dirname, "./src/components/layout"),
    "@products": path.resolve(__dirname, "./src/components/products"),
    "@ui": path.resolve(__dirname, "./src/components/ui"),
    "@hooks": path.resolve(__dirname, "./src/hooks"),
    "@context": path.resolve(__dirname, "./src/context"),
    "@providers": path.resolve(__dirname, "./src/providers"),
    "@utils": path.resolve(__dirname, "./src/utils"),
    "@api": path.resolve(__dirname, "./src/api"),
    "@config": path.resolve(__dirname, "./src/config"),
};
