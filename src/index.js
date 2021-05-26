// @ts-check
import i18nInstance from './i18nInstance';
import init from './init';
import resources from './locales';

const defaultLanguage = 'ru';

const start = () => {
  i18nInstance
    .init({
      lng: defaultLanguage,
      debug: false,
      resources,
    })
    .then(function () {
      // initialized and ready to go!
      init();
    });
};

start();

export default start;
