// * Next:


export const MODULES = [
    {
        "name": "config_modules_map_name",
        "href": "/map"
    },
    {
        "name": "config_modules_ranking_name",
        "href": "/ranking"
    }
] as const;

// * Export Types:
export type ConfigModules = typeof MODULES;
export type ConfigModule = ConfigModules[number];
