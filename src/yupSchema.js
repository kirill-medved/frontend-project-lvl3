// @ts-check
import * as yup from 'yup';

const schema = yup.object().shape({
  url: yup.string().url().required(),
});

export default schema;
