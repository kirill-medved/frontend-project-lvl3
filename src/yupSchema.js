// @ts-check
import * as yup from 'yup';
import i18nInstance from './i18nInstance';

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

const schema = yup.object().shape({
  url: yup.string().url().required(),
});

export default schema;
