import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./es.json";
import en from "./en.json";

const resources = {
	es: { translation: es },
	en: { translation: en }
};

i18n.use(initReactI18next).init({
	compatibilityJSON: "v3",
	lng: "es",
	fallbackLng: "es",
	resources,
	interpolation: { escapeValue: false }
});

export const t = i18n.t.bind(i18n);
export default i18n;