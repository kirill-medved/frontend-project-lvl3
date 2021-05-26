// @ts-check
import * as _ from 'lodash';
import axios from 'axios';

import rssParser from '../parsers/rssParser';
import watchedState from '../state';
import schema from '../yupSchema';

const formHandler = (e) => {
  e.preventDefault();

  const url = document.querySelector('input[aria-label=url]').value;
  const objData = { url };

  const documentEl = document.querySelector('body');
  const divEl = document.createElement('div');
  divEl.textContent =
    'HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII!!';
  documentEl.append(divEl);
  // const formData = new FormData(e.target);
  // const objData = Object.fromEntries(formData);
  schema
    .validate(objData)
    .catch(function (err) {
      const divEl2 = document.createElement('div');
      divEl2.textContent = `H2222222222222222222222222222222222222222222222222222222!!${err}`;
      documentEl.append(divEl2);
      if (!err.errors) return true;
      watchedState.rssForm.state = err.type;
      return false;
    })
    .then((isValid) => {
      if (!isValid) return;
      watchedState.rssForm.isActive = true;
      axios
        .get(
          `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
            objData.url.toString(),
          )}`,
        )
        .then((response) => {
          const divEl3 = document.createElement('div');
          divEl3.textContent = `HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII!!${response.data.contents}`;
          documentEl.append(divEl3);
          if (response.status === 200) return response.data;
          watchedState.rssForm.isActive = false;
          watchedState.rssForm.state = 'networkError';
          throw new Error('Network response was not ok.');
        })
        .then((data) => data.contents)
        .then((data) => {
          try {
            const obj = rssParser(data);
            return obj;
          } catch (error) {
            watchedState.rssForm.isActive = false;
            watchedState.rssForm.state = 'notValid';
          }
        })
        .then(({ title, description, posts }) => {
          const divEl4 = document.createElement('div');
          divEl4.textContent = `HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII!!${title}`;
          documentEl.append(divEl4);
          const newFeed = { title, description, url: objData.url.toString() };
          if (_.some(watchedState.feeds, newFeed)) {
            watchedState.rssForm.isActive = false;
            watchedState.rssForm.state = 'exists';
            throw new Error('Network response was not ok.');
          }
          const postWithId = posts.map((post, i) => ({
            ...post,
            id: watchedState.posts.length + i + 2,
          }));
          watchedState.rssForm.isActive = false;
          watchedState.rssForm.state = 'success';
          watchedState.feeds.push(newFeed);
          watchedState.posts.push(...postWithId);
        })
        .catch((error) => {
          console.log(error);
        });
    });
};

export default formHandler;
