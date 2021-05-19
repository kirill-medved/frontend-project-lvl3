// @ts-check
import watchedState from '../state';

const postsModalHandler = () => {
  const ModalEl = document.getElementById('exampleModal');
  ModalEl.addEventListener('hide.bs.modal', function (event) {
    watchedState.postModal.isActive = false;
  });
};

export default postsModalHandler;
