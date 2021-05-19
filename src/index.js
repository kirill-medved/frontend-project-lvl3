// @ts-check

import * as _ from 'lodash';
import * as yup from 'yup';
import i18next from 'i18next';
import parser from './parsers/rssParser';
import axios from 'axios';
import resources from './locales';
import watchedState from './state';

const defaultLanguage = 'ru';
const defaultTimeoutCheckNewPosts = 5000;

const start = () => {
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

  const render = (container, watchedState, i18nInstance) => {};

  const formEl = document.querySelector('form');
  const formHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const objData = Object.fromEntries(formData);
    schema
      .validate(objData)
      .catch(function (err) {
        if (!err.errors) return true;
        watchedState.rssForm.state = err.type;
        return false;
      })
      .then((isValid) => {
        if (!isValid) return;

        fetch(
          `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
            objData.url.toString(),
          )}`,
        )
          .then((response) => {
            if (response.ok) return response.json();
            watchedState.rssForm.state = 'networkError';
            throw new Error('Network response was not ok.');
          })
          .then((data) => data.contents)
          .then((data) => {
            try {
              const obj = parser(data);
              return obj;
            } catch (error) {
              watchedState.rssForm.state = 'notValid';
            }
          })
          .then(({ title, description, posts }) => {
            const newFeed = { title, description, url: objData.url.toString() };
            if (_.some(watchedState.feeds, newFeed)) {
              watchedState.rssForm.state = 'exists';
              throw new Error('Network response was not ok.');
            }
            const postWithId = posts.map((post, i) => ({
              ...post,
              id: watchedState.posts.length + i + 2,
            }));
            watchedState.rssForm.state = 'success';
            watchedState.feeds.push(newFeed);
            watchedState.posts.push(...postWithId);
          })
          .catch((error) => {
            // TODO:
            // - add state.possessing = 'failed' | 'processing' | 'filling'
            // - add preloader fro processing
            // - add bootstrap alert for failed
            console.log(error);
          });
      });

    render();
  };
  formEl.addEventListener('submit', formHandler);
  render();

  const myModalEl = document.getElementById('exampleModal');
  myModalEl.addEventListener('hide.bs.modal', function (event) {
    watchedState.postModal.isActive = false;
  });

  const checkNewPosts = (time) => {
    setTimeout(() => {
      watchedState.feeds.forEach((feed) => {
        axios
          .get(
            `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
              feed.url.toString(),
            )}`,
          )
          .then((response) => {
            if (response.status === 200) return response.data;
            throw new Error('Network response was not ok.');
          })
          .then((data) => data.contents)
          .then((data) => {
            return parser(data);
          })
          .then((data) => {
            const { posts } = data;
            const newPosts = _.differenceBy(posts, watchedState.posts, 'link');
            if (!newPosts.length) return;
            const postWithId = newPosts.map((post, i) => ({
              ...post,
              id: watchedState.posts.length + i + 2,
            }));
            watchedState.posts.push(...postWithId);
          })
          .catch((error) => {
            // TODO:
            // - add state.possessing = 'failed' | 'processing' | 'filling'
            // - add preloader fro processing
            // - add bootstrap alert for failed
            console.log(error);
          });
      });
      checkNewPosts(defaultTimeoutCheckNewPosts);
    }, time);
  };
  checkNewPosts(defaultTimeoutCheckNewPosts);
};

// каждый запуск приложения создаёт свой собственный объект i18n и работает с ним,
// не меняя глобальный объект.
const i18nInstance = i18next.createInstance();

const startAll = () => {
  i18nInstance
    .init({
      lng: defaultLanguage,
      debug: false,
      resources,
    })
    .then(function () {
      // initialized and ready to go!
      start();
    });
};

startAll();
export { i18nInstance };
