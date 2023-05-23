import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { store, updateFrame, birdjump, game, states, rungame } from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App store={store} updateFrame={updateFrame} game={game}/>
);

function onpress(evt) {

    switch (game.currentstate) {
    default:
    case states.Splash:
      rungame()
      birdjump(store.bird)
      break
    case states.Game:
      birdjump(store.bird)
      break
    case states.Score:
      break
  }

}
document.addEventListener('mousedown', onpress);
document.body.onkeydown  = function(e) {
  if (e.key == " " ||
      e.code == "Space" ||      
      e.keyCode == 32      
  ) {
    onpress();
  }
}