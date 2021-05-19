// @ts-check
import axios from 'axios';
import * as _ from 'lodash';

import rssParser from '../parsers/rssParser';
import watchedState from '../state';

const defaultTimeoutCheckNewPosts = 5000;
rssParser;

const updatePosts = (time) => {
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
          return rssParser(data);
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
    updatePosts(defaultTimeoutCheckNewPosts);
  }, time);
};

export default updatePosts;
