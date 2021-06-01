import onChange from 'on-change';
import * as _ from 'lodash';
import {
  addFeed,
  addPost,
  showFeedback,
  disableFeedback,
} from './api/actions/htmlActions';
import i18nInstance from './i18nInstance';

const state = {
  feeds: [],
  posts: [],
  readPosts: [],
  postModal: {
    isActive: false,
    currentPost: null,
  },
  rssForm: {
    isActive: false,
    state: null,
  },
};

const watchedState = onChange(state, (path, value, previousValue) => {
  switch (path) {
    // инициализированный объект i18n прокидывается параметром в рендер, чтобы использовать t.
    case 'feeds':
      console.log("I'm AT FEEDS ");
      const feedsConteinerEl = document.querySelector('#feeds > div > ul');
      console.log(feedsConteinerEl);
      const newFeeds = _.difference(value, previousValue);
      console.log(newFeeds);
      newFeeds.forEach((feed) => {
        console.log('CHECK FEED');
        console.log(feed);
        const liEl = addFeed(feed);
        console.log(liEl);
        feedsConteinerEl.append(liEl);
        console.log(feedsConteinerEl);
      });
      break;

    case 'posts':
      console.log("I'm AT Posts ");
      const postsConteinerEl = document.querySelector('#posts > div > ul');
      const newPosts = _.difference(value, previousValue);

      newPosts.forEach((post) => {
        const liEl = addPost(post);
        postsConteinerEl.appendChild(liEl);
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
      postEl.classList.remove('fw-bold');
      postEl.classList.add('fw-normal');

    case 'rssForm.state':
      const error = i18nInstance.t(`formControl.${value}`);
      showFeedback(error);
      break;

    case 'rssForm.isActive':
      const formSubmitButton = document.querySelector('button[name=add]');
      if (value) {
        formSubmitButton.disabled = value;
      } else {
        formSubmitButton.disabled = value;
      }
      break;
    default:
      break;
  }
});

export default watchedState;
