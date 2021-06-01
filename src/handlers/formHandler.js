// @ts-check
import * as _ from 'lodash';
import axios from 'axios';

import rssParser from '../parsers/rssParser';
import watchedState from '../state';
import schema from '../yupSchema';

const formHandler = (e) => {
  // e.preventDefault();
  watchedState.rssForm.isActive = true;
  const url = document.querySelector('input[aria-label=url]').value;
  const objData = { url };

  const documentEl = document.querySelector('body');
  const divEl = document.createElement('div');
  divEl.textContent = `HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII!!${schema}`;
  documentEl.append(divEl);
  // const formData = new FormData(e.target);
  // const objData = Object.fromEntries(formData);
  console.log('Start schema');
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
      console.log('schema valid' + Object.entries(isValid));
      if (!isValid) return;

      console.log('start request!');
      axios
        .get(
          `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(
            objData.url.toString(),
          )}&disableCache=true`,
        )
        .then((response) => {
          console.log('get response' + response);
          const divEl3 = document.createElement('div');
          divEl3.textContent = `HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII!!${response.data.contents}`;
          documentEl.append(divEl3);
          if (response.status === 200) return response.data;
          console.log('COCU');
          watchedState.rssForm.isActive = false;
          watchedState.rssForm.state = 'networkError';
          throw new Error('Network response was not ok.');
        })
        .then((data) => data.contents)
        .then((data) => {
          console.log('get Data');
          console.log(data);
          try {
            const obj = rssParser(data);
            console.log(obj);
            return obj;
          } catch (error) {
            console.log('Errororo');
            watchedState.rssForm.isActive = false;
            watchedState.rssForm.state = 'notValid';
          }
        })
        .then(({ title, description, posts }) => {
          console.log('data valid' + description + title);
          const divEl4 = document.createElement('div');
          divEl4.textContent = `HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII!!${title}`;
          documentEl.append(divEl4);
          const newFeed = { title, description, url: objData.url.toString() };
          if (_.some(watchedState.feeds, newFeed)) {
            console.log(`check some ${_.some(watchedState.feeds, newFeed)}`);
            watchedState.rssForm.isActive = false;
            watchedState.rssForm.state = 'exists';
            return;
            // throw new Error('Network response was not ok.');
          }
          console.log(`draw feeds and posts`);
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

  const divEl5 = document.createElement('div');
  divEl5.textContent =
    'HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII!!ENNNNNNDDD';
  documentEl.append(divEl5);
};

export default formHandler;
