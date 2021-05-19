import onChange from 'on-change';
import * as _ from 'lodash';
import {
  addFeed,
  addPost,
  showFeedback,
  disableFeedback,
} from './api/actions/htmlActions';
import { i18nInstance } from '.';

const state = {
  feeds: [],
  posts: [],
  readPosts: [],
  postModal: {
    isActive: false,
    currentPost: null,
  },
  rssForm: {
    state: null,
  },
};

const watchedState = onChange(state, (path, value, previousValue) => {
  switch (path) {
    // инициализированный объект i18n прокидывается параметром в рендер, чтобы использовать t.
    case 'feeds':
      const feedsConteinerEl = document.querySelector('#feeds > div > ul');
      const newFeeds = _.difference(value, previousValue);

      newFeeds.forEach((feed) => {
        const liEl = addFeed(feed);
        feedsConteinerEl.append(liEl);
      });
      break;

    case 'posts':
      const postsConteinerEl = document.querySelector('#posts > div > ul');
      const newPosts = _.difference(value, previousValue);

      newPosts.forEach((post) => {
        const liEl = addPost(post);
        postsConteinerEl.append(liEl);
      });
      break;

    case 'postModal.isActive':
      if (!value) return;
      const modalTitle = document.querySelector('#exampleModalLabel');
      const modalBody = document.querySelector('.modal-body');
      const modalHref = document.querySelector('.modal-footer > a');
      modalTitle.textContent = watchedState.postModal.currentPost.title;
      modalBody.textContent = watchedState.postModal.currentPost.description;
      modalHref.href = watchedState.postModal.currentPost.link;
      break;

    case 'readPosts':
      const newReadPost = _.difference(value, previousValue)[0];
      const id = newReadPost.id;

      const postEl = document.querySelector(`a[data-id='${id}']`);
      console.log(id);
      console.log(postEl);
      postEl.classList.remove('fw-bold');
      postEl.classList.add('fw-normal');

    case 'rssForm.state':
      const error = i18nInstance.t(`formControl.${value}`);
      showFeedback(error);
      setTimeout(() => {
        disableFeedback();
      }, 3000);
      break;
    default:
      break;
  }
});

export default watchedState;
