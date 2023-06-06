import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import {bg,fg, bird0, bird1, bird2, pipeN, pipeS, pause, play, gameover, _ok_, splash, ready, _rate_, _score_, _menu_, _share_, _start_, num0, num1, num2, num3, num4, num5, num6, num7, num8, num9 } from './common/Sprite';
import {width, height} from './common/common';
import { observer} from 'mobx-react';
import {rungame, states} from './store/store';
import {ratio} from './common/common.js'

let lastActionTime = 0;

const rx = ratio.ratio_w;
const ry = ratio.ratio_h;
const _scale_ = rx+" "+ry || 1;

const SpriteWrapper = observer(class SpriteWrapper extends Component {

  render() {
    const gameSprite = this.props.gameSprite;
    const scale = gameSprite.scale || 1;
    const rotate = 'rotate('+ gameSprite.rotation +'rad)'
    const translate = 'translate(' + gameSprite.cx + 'px,' + gameSprite.cy + 'px)'
    const ctrans = (gameSprite.rotation == null) ? translate : translate + ' ' + rotate;
    const onClickHandler = (this.props.onClickHandler) == null ? null : this.props.onClickHandler;
    var style = {
      transform: ctrans,
      scale: scale,
      position: 'absolute'
    }

    return (
      <div style={style} onClick={onClickHandler}>
        {this.props.children}
      </div>)
  }
})

const Bg = observer(
  class Bg extends Component {
  render() {
      return <SpriteWrapper gameSprite={this.props.bg}> {bg} </SpriteWrapper>;
  }

})

const Fg = observer(
  class Fg extends Component {
  render() {
      return <SpriteWrapper gameSprite={this.props.fg}> {fg} </SpriteWrapper>;
  }

})

export const Bird = observer(
   class Bird extends Component {

      render() {
          let wbird;
          switch(this.props.bird.frame) {
            case 1:
            case 3:
              wbird = bird1
              break
            case 2:
              wbird = bird2
              break
            case 0:
            default:
              wbird = bird0
              break
          }

          return <SpriteWrapper gameSprite={this.props.bird}> {wbird} </SpriteWrapper>;
      }
   }
)

const Pipe = observer(
  class Pipe extends Component {
  render() {
    let wpipe;
    switch(this.props.pipe.type) {
      default:
      case "N":
        wpipe = pipeN
        break
      case "S":
        wpipe = pipeS
        break
    }

    return <SpriteWrapper gameSprite={this.props.pipe}> {wpipe} </SpriteWrapper>;

  }
})

const Gameover = observer(
  class Gameover extends Component {

  render() {
      return <SpriteWrapper gameSprite={{cx: (width/2 - 94)/rx, cy: height/ry-400, scale: _scale_}}> {gameover} </SpriteWrapper>;
  }

})

export const Pause = observer(
  function Pause(props) {
    const handleClick = () => {
      props.onPausedChange(!props.paused)
    }
    let btn = props.paused ? play : pause    
    return <SpriteWrapper gameSprite={{cx: (width - 13 - 13*rx)/rx, cy: 7*ry - 7, scale: _scale_}} onClickHandler={handleClick}> {btn} </SpriteWrapper>;
})

export const OK = observer(
  function OK(props) {
    const handleClick = () => {
      props.onPausedChange(!props.paused)
      rungame();
    }
      return <SpriteWrapper gameSprite={{cx: (width/2 - 40)/rx, cy: height/ry-3, scale: _scale_}} onClickHandler={handleClick} > {_ok_} </SpriteWrapper>;
})

/*export const Rate = observer(
  class Rate extends Component {
    render() {
        return <SpriteWrapper gameSprite={{cx: width-80, cy: height-480}}> {_rate_} </SpriteWrapper>;
    }
})*/

/*export const Score = observer(
  class Score extends Component {
    render() {
        return <SpriteWrapper gameSprite={{cx: (width-80)/rx, cy: height/ry-480, scale: _scale_}}> {_score_} </SpriteWrapper>;
    }
})*/

export const Menu = observer(
  function Menu(props) {
    return <SpriteWrapper gameSprite={{cx: (width/2 - 40 + props.x*rx)/rx, cy: height/ry-180, scale: _scale_}}> {_menu_} </SpriteWrapper>;
})

/*export const Share = observer(
  class Share extends Component {
    render() {
        return <SpriteWrapper gameSprite={{cx: width-80, cy: height-480}}> {_share_} </SpriteWrapper>;
    }
})*/

export const Start = observer(
  function Start(props) {
    const handleClick = () => {
      props.onPausedChange(!props.paused)
    }
    return <SpriteWrapper gameSprite={{cx: (width/2 - 40 + props.x*rx)/rx, cy: height/ry-180, scale: _scale_}} onClickHandler={handleClick}> {_start_} </SpriteWrapper>;
})

export const Splash = observer(
  class Splash extends Component {

  render() {
      return <SpriteWrapper gameSprite={{cx: (width/2 - 59)/rx, cy: height/ry-300, scale: _scale_}}> {splash} </SpriteWrapper>;
  }

})

export const Ready = observer(
  class Ready extends Component {

  render() {
      return <SpriteWrapper gameSprite={{cx: (width/2 - 87)/rx, cy: height/ry-380, scale: _scale_}}> {ready} </SpriteWrapper>;
  }

})

const ScoreBoard = ({ score }) => {
  // Convertissez le score en une chaîne de caractères
  const scoreString = score.toString();

  return (
    <SpriteWrapper gameSprite={{cx: (width/2 - 7*scoreString.length)/rx, cy: height/ry-450, scale: _scale_}}>
      <div className='score'>
        {scoreString.split('').map((digit, index) => (
          <div key={index}>{getDigitImage(digit)}</div>
        ))}
      </div>
    </SpriteWrapper>
  );
};

// Fonction utilitaire pour obtenir l'image correspondant au chiffre
const getDigitImage = (digit) => {
  // Associez chaque chiffre à son image correspondante
  switch (digit) {
    case '0':
      return num0;
    case '1':
      return num1;
    case '2':
      return num2;
    case '3':
      return num3;
    case '4':
      return num4;
    case '5':
      return num5;
    case '6':
      return num6;
    case '7':
      return num7;
    case '8':
      return num8;
    case '9':
      return num9;
    default:
      return null; // ou une image par défaut si nécessaire
  }
};


const App = observer(
  class App extends Component {
    state = {
        paused: false,
      };

    handlePausedChange = (paused) => {
      this.setState({ paused });
      };

    componentDidMount() {
      requestAnimationFrame(this.update);
    }

    update = (currentTime) => {
      const elapsed = currentTime - lastActionTime;
      const actionInterval = 1000 / this.props.store.desiredActionPerSecond; 
      
      if(elapsed >= actionInterval && !this.state.paused) {
        this.props.updateFrame(); // Appeler la fonction updateFrame du store avec le temps écoulé
      
        lastActionTime = currentTime;
      }

      this.req = requestAnimationFrame(this.update); // Appeler update à chaque frame
    };

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.game.currentstate === states.Score && !this.state.paused) {
        this.setState({ paused: true });
      }
    }

    

    render() {
      const { bgs, fgs, bird, pipes, score } = this.props.store;
      const { currentstate } = this.props.game;
      
      const style = {
        width: width,
        height: height
      };

      return (
        <div className="App" id="fakingcanvas" style={style}>
          {bgs.map((bg) => (
            <Bg bg={bg} key={bg.id} />
          ))}
          {pipes.map((pipe) => (
            <Pipe pipe={pipe} key={pipe.id} />
          ))}
          <Bird bird={bird} />
          <ScoreBoard score={score} />
          {currentstate === states.Score ? <Gameover /> : null}
          {currentstate === states.Score ? <OK paused={this.state.paused} onPausedChange={this.handlePausedChange} /> : null}
          {currentstate === states.Game ? <Pause paused={this.state.paused} onPausedChange={this.handlePausedChange} /> : null}
          {(currentstate === states.Game) && this.state.paused ? <><Start x={50} paused={this.state.paused} onPausedChange={this.handlePausedChange}/><Menu x={-50} /></>   : null}
          {currentstate === states.Splash ? <Splash /> : null}
          {currentstate === states.Splash ? <Ready /> : null}
          {currentstate === states.Splash ? <Start x={0} /> : null}
          {fgs.map((fg) => (
            <Fg fg={fg} key={fg.id} />
          ))}
        </div>
      );
    }
  }
);


export default App
