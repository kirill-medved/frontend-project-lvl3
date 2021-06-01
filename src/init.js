// @ts-check
import i18nInstance from './i18nInstance';
import * as yup from 'yup';

import updatePosts from './api/updatePosts';
import formHandler from './handlers/formHandler';
import postsModalHandler from './handlers/postsModalHandler';
import resources from './locales';

const defaultTimeoutCheckNewPosts = 5000;
const defaultLanguage = 'ru';

const initHandlers = () => {
  const formEl = document.querySelector('form');
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  const formSubmitButton = document.querySelector('button[name=add]');
  formSubmitButton.addEventListener('click', formHandler);

  postsModalHandler();

  updatePosts(defaultTimeoutCheckNewPosts);
};

const init = () => {
  i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  yup.setLocale({
    string: {
      url: ({ url }) => ({
        key: i18nInstance.t('formControl.url'),
        values: { url },
      }),
    },
    mixed: {
      required: ({ url }) => ({
        key: i18nInstance.t('formControl.required'),
        values: { url },
      }),
    },
  });

  initHandlers();
};
export default init;
