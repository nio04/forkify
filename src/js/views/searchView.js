import View from './View';

class SearchView extends View {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearSearchField();
    return query;
  }

  _clearSearchField() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', ev => {
      ev.preventDefault();

      handler();
    });
  }
}

export default new SearchView();
