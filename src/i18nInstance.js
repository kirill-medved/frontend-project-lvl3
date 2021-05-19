// @ts-check
import i18next from 'i18next';

// каждый запуск приложения создаёт свой собственный объект i18n и работает с ним,
// не меняя глобальный объект.
const i18nInstance = i18next.createInstance();

export default i18nInstance;
