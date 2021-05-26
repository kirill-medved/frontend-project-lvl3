// @ts-check
// @ts-check

import updatePosts from './api/updatePosts';
import formHandler from './handlers/formHandler';
import postsModalHandler from './handlers/postsModalHandler';

const defaultTimeoutCheckNewPosts = 5000;

const init = () => {
  const formEl = document.querySelector('form');
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  const formSubmitButton = document.querySelector('button[name=add]');
  formSubmitButton.addEventListener('click', formHandler);

  postsModalHandler();

  updatePosts(defaultTimeoutCheckNewPosts);
};

export default init;
