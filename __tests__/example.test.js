import {
  getByRole,
  findByText,
  getByPlaceholderText,
  screen,
} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';
import formHandler from '../src/handlers/formHandler';

const renderContent = () => {
  document.body.innerHTML = `
    <div id="point">
        <div class="container">
            <div class="row">
                <h1 class="col-md-auto">RSS agregator</h1>
            </div>
            <div class="row rounded">
                <form class="row justify-content-md-center" role="form">
                    <input role="textbox" aria-label="url" type="text" name="url" class="col"
                        placeholder="ссылка RSS" />
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
  `;

  const formEl = screen.getByRole('form');

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  const buutonEl = screen.getByRole('button', { name: 'add' });
  buutonEl.addEventListener('click', async (e) => {
    const divEl = document.createElement('div');
    divEl.textContent = 'HIIIIII!!!!!!!!!!!!!!!!!';
    await formHandler(e);
    const formEl = screen.getByRole('form');
    formEl.append(divEl);
  });
};

describe('findByText Examples', () => {
  beforeEach(async () => {
    renderContent();
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
