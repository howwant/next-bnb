declare module "googlemaps"

declare global {
    interface Window {
        google: any;
        initmap: () => void;
    }
}