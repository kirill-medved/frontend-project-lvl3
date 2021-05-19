// @ts-check

import watchedState from '../../state';

const addFeed = (feed) => {
  const liEl = document.createElement('li');
  const h3El = document.createElement('h3');
  const pEL = document.createElement('p');
  liEl.classList.add('list-group-item');
  h3El.textContent = feed.title;
  pEL.textContent = feed.description;
  liEl.append(h3El);
  liEl.append(pEL);
  return liEl;
};

const addPost = (post) => {
  const liEl = document.createElement('li');
  const aEl = document.createElement('a');
  const buttonEL = document.createElement('button');
  liEl.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
  );
  aEl.textContent = post.title;
  aEl.href = post.link;
  aEl.classList.add('fw-bold');
  aEl.dataset.id = post.id;
  aEl.target = '_blank';
  aEl.rel = 'noopener noreferrer';
  buttonEL.textContent = 'Просмотр';
  buttonEL.type = 'button';
  // type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  buttonEL.classList.add('btn', 'btn-primary');
  buttonEL.dataset.id = post.id;
  buttonEL.dataset.bsToggle = 'modal';
  buttonEL.dataset.bsTarget = '#exampleModal';
  buttonEL.addEventListener('click', (e) => {
    const currentPost = watchedState.posts.filter(
      (post) => post.id === +e.target.dataset.id,
    )[0];
    watchedState.postModal.currentPost = currentPost;
    watchedState.postModal.isActive = true;
    watchedState.readPosts.push(currentPost);
  });
  liEl.append(aEl);
  liEl.append(buttonEL);

  return liEl;
};

const showFeedback = (err) => {
  const feedbackEl = document.querySelector('.feedback');
  feedbackEl.classList.add('alert', 'alert-warning');
  feedbackEl.textContent = err;
};

const disableFeedback = () => {
  const feedbackEl = document.querySelector('.feedback');
  feedbackEl.classList.remove('alert', 'alert-warning');
  feedbackEl.textContent = '';
};

export { addFeed, addPost, showFeedback, disableFeedback };
