// * i18n:
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// * Resources:
import common_en from './en/common.json';
import common_de from './de/common.json';
import common_it from './it/common.json';
import common_es from './es/common.json';
import common_fr from './fr/common.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: common_en },
            de: { translation: common_de },
            it: { translation: common_it },
            es: { translation: common_es },
            fr: { translation: common_fr }
        },
        lng: "en",
        supportedLngs: ["en", "es", "de", "it", "fr"],
        fallbackLng: "en",
        interpolation: {
            escapeValue: false 
        }
    });

export default i18n;