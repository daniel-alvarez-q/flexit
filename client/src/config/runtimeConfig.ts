export type AppConfig = {
    API_URL:string;
}

declare global{
    interface Window {
        __APP_CONFIG__?: Partial<AppConfig>
    }
}

export function readRuntimeConfig():AppConfig {
    //DEV mode
    if (import.meta.env.DEV){
        if(!import.meta.env.VITE_BACKEND_URL){
            throw new Error("Missing environment variable: VITE_BACKEND_URL")
        }

        return {API_URL:import.meta.env.VITE_BACKEND_URL}
    }

    //PROD mode
    const runtimeConfig = window.__APP_CONFIG__ ?? {}

    if(!runtimeConfig.API_URL){
        throw new Error("Missing runtime config: API_URL")
    }

    return {
        API_URL: runtimeConfig.API_URL
    }
}