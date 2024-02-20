import icons from 'url:../../img/icons.svg';

import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'no recipe found for your query. please try again';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
