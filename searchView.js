class SearchView {
  _parentE = document.querySelector('.search');

  getQuery() {
    const query = this._parentE.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentE.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentE.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
