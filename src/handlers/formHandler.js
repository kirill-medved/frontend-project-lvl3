// @ts-check
import * as _ from 'lodash';
import axios from 'axios';

import rssParser from '../parsers/rssParser';
import watchedState from '../state';
import schema from '../yupSchema';

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

      axios
        .get(
          `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
            objData.url.toString(),
          )}`,
        )
        .then((response) => {
          console.log('HI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
          console.log(response);
          console.log(response.status);
          console.log('HI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
          if (response.status === 200) return response.data;
          watchedState.rssForm.state = 'networkError';
          throw new Error('Network response was not ok.');
        })
        .then((data) => data.contents)
        .then((data) => {
          try {
            const obj = rssParser(data);
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
};

export default formHandler;
