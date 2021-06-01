import {
  getByRole,
  findByText,
  getByPlaceholderText,
  screen,
} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';
import start from '../src';

const renderContent = () => {
  document.body.innerHTML = `
    <div id="point" >
      <div class="container">
        <div class="row">
          <h1 class="col-md-auto">RSS agregator</h1>
        </div>
        <div class="row rounded" >
          <form class="row justify-content-md-center" role="form">
            <input role="textbox" aria-label="url" type="text" name="url" class="col" placeholder="ссылка RSS"/>
            <button role="button" name="add" type="submit" class="col">add</button>
          </form>
          <div class="feedback"></div>
        </div>
      </div>
      <section>
        <div id="feeds" class="row">
          <div class="col-md-10 col-lg-8 mx-auto feeds">
            <h2>Фиды</h2>
            <ul class="list-group mb-5"></ul>
          </div>
        </div>
        <div id="posts" class="row">
          <div class="col-md-10 col-lg-8 mx-auto posts">
            <h2>Посты</h2>
            <ul class="list-group mb-5"></ul>
          </div>
        </div>
      </section>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
            <a role="button" class="btn btn-primary full-article" target="_blank" rel="noopener noreferrer">Читать полностью</a>
          </div>
        </div>
      </div>
    </div>
  `;
};

describe('findByText Examples', () => {
  beforeEach(async () => {
    await renderContent();
    await start();
  });

  it('should work', async () => {
    const inputEl = screen.getByRole('textbox', { name: 'url' });
    const buttonEl = screen.getByRole('button', { name: 'add' });
    userEvent.type(inputEl, 'https://ru.hexlet.io/lessons.rss');
    userEvent.click(buttonEl);

    expect(
      await screen.findByText(/RSS успешно загружен/i),
    ).toBeInTheDocument();
  });
});
