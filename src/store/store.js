import {bg, fg, bird, pipe } from './asset'    // Import required classes from asset file
import { height } from '../common/common';
import { bg_h, bg_w, fg_h, fg_w, pipe_h, pipe_w, bird_h, bird_w} from '../common/Sprite'; //To get sprite properties
//import { setBg_h, setBg_w, setBird_h, setBird_w, setFg_h, setFg_w, setPipe_h, setPipe_w } from '../common/Sprite';
import {action, observable } from 'mobx';    // Import required classes from mobx library
import {ratio} from '../common/common.js';

var start, end;

const rx = ratio.ratio_w;
const ry = ratio.ratio_h;

const bg1 = new bg(guid(), 0, height/ry - bg_h)    // Initialize bg object at 0,0
const bg2 = new bg(guid(), bg_w, height/ry - bg_h)    // Initialize bg object at bg_w,0

//Build the moving ground
const fg1 = new fg(guid(), 0, height/ry - fg_h/ry )    // Initialize fg object at 0,0
const fg2 = new fg(guid(), fg_w, height/ry - fg_h/ry )    // Initialize fg object at fg_w,0

export const states = {
   Splash: 0, Game: 1, Score: 2    // Define states of game
}

//Game state
export const game = observable({
    currentstate:0,    // Initialize current state
})

export const store = {
  bird : new bird(guid(),60,0),    // Initialize bird object
  fgpos: 0,    // Initialize fg position
  frames: 1,    // Initialize number of frames
  bgs: [ bg1, bg2 ],    // Initialize array of bg objects
  fgs: [ fg1, fg2 ],    // Initialize array of fg objects
  pipes: observable([]), //initialize with empty pipe
  score: 0,    // Initialize score
  desiredActionPerSecond: 100, // Initialize number of action per second
}

function guid() {    // generate unique id
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

const updateBird = function(bird) {

  bird.frame += store.frames % 10 === 0 ? 1 : 0;    // change bird frame
  bird.frame %= bird.animation.length; //at every 10th, frame change bird frame

  if (game.currentstate === states.Splash) { //if splash screen make the bird hover

    bird.cy = height/ry - 280 + 5*Math.cos(store.frames/10)  // ~199 - ~201
    bird.rotation = 0;

  } else {

    bird.velocity += bird.gravity;
  	bird.cy += bird.velocity;

    if (bird.cy >= (height - fg_h*ry)/ry-10) {
      bird.cy = (height - fg_h*ry)/ry -10;
      console.log(bird)
      console.log(fg_h*ry)
      console.log(ry)
      console.log(rx)
      if (game.currentstate === states.Game) {
            end = new Date();

            game.currentstate = states.Score;

  		}
      // sets velocity to jump speed for correct rotation
      bird.velocity = bird._jump;
    }

    // when bird lack upward momentum increment the rotation
    // angle
    if (bird.velocity >= bird._jump) {

      bird.frame = 1;
      bird.rotation = Math.min(Math.PI/2, bird.rotation + 0.3);

    } else {

      bird.rotation = -0.3;

    }
  }
}

const updatePipe = function() {

  if (store.frames % 100 === 0) {

    var _y = height/ry - (pipe_h + fg_h +120/ry+200*Math.random());    // Generate random number
    store.pipes.push(
      new pipe(guid(), pipe_h, _y, "S"),
      new pipe(guid(), pipe_h, _y+100+ pipe_h, "N")
    )
  }
  store.pipes.forEach((p) => {
    const bird = store.bird;
    var cx = Math.min(Math.max(bird.cx, p.cx), p.cx + pipe_w * rx);
    var cy = Math.min(Math.max(bird.cy + bird_h * ry / 2, p.cy), p.cy + pipe_h * ry);

    if (bird.cx + bird_w * rx / 2 > p.cx && !p.scored) {
      p.scored = true;
      store.score += 0.5;
    }

      // closest difference
      var dx = bird.cx + (bird_w*rx)/2 - cx;
      var dy = bird.cy + (bird_h*ry)/2 - cy;
  
      // vector length
      var d1 = dx*dx + dy*dy;
      var r = (bird.radius*rx)*(bird.radius*rx);

      var check_collision = checkCollision(bird, p, bird_w, bird_h, pipe_w, pipe_h, rx, ry);
      
    if(check_collision.bool) {
      game.currentstate = states.Score;
    }

    p.cx -= 2;

    if (p.cx < -pipe_w * rx) {
      store.pipes.splice(0, 2);
    }
  });
};

function checkCollision(bird, pipe, bird_w, bird_h, pipe_w, pipe_h, rx, ry) {
  var pipe_cx = pipe.cx * rx + (pipe_w*rx)/2;
  if(pipe_cy < height*ry/2)
    var pipe_cy = pipe.cy * ry + (pipe_h*ry)/2;
  else
    var pipe_cy = pipe.cy *ry + pipe_h/2;
  var bird_cx = bird.cx * rx + (bird_w)/2;
  var bird_cy = bird.cy * ry + (bird_h)/2;
  var radius = bird.radius;

  // Find the half widths and heights of the bird and pipe
  var halfBirdWidth = bird_w*rx / 2;
  var halfBirdHeight = bird_h*ry / 2;
  var halfPipeWidth = pipe_w*rx / 2;
  var halfPipeHeight = pipe_h*ry / 2;

  // Calculate the minimum and maximum x and y coordinates for the bird and pipe
  var birdMinX = bird_cx - halfBirdWidth;
  var birdMaxX = bird_cx + halfBirdWidth;
  var birdMinY = bird_cy - halfBirdHeight;
  var birdMaxY = bird_cy + halfBirdHeight;
  var pipeMinX = pipe_cx - halfPipeWidth;
  var pipeMaxX = pipe_cx + halfPipeWidth;
  var pipeMinY = pipe_cy - halfPipeHeight;
  var pipeMaxY = pipe_cy + halfPipeHeight;

  // Check if the bounding boxes of the bird and pipe intersect
  if (
    birdMinX > pipeMaxX ||
    birdMaxX < pipeMinX ||
    birdMinY > pipeMaxY ||
    birdMaxY < pipeMinY
  ) {
    return { bool: false, message: "no-collision" };
  }

  // Calculate the distances from the bird's center to the nearest point on the pipe's edges
  var nearestX = Math.max(pipeMinX, Math.min(bird_cx, pipeMaxX));
  var nearestY = Math.max(pipeMinY, Math.min(bird_cy, pipeMaxY));
  var deltaX = bird_cx - nearestX;
  var deltaY = bird_cy - nearestY;
  
  // Check if the squared distances are less than or equal to the squared radius
  return {
    bool:
      deltaX * deltaX + deltaY * deltaY <=
      (radius * radius * (rx * rx + ry * ry)),
    message: "collision : "+deltaX * deltaX + deltaY * deltaY+" , "+radius * radius * (rx * rx + ry * ry),
  };
}


export const birdjump =  action(function(bird) {

    bird.velocity = -bird._jump;    // Bird jump action
    console.log('bird.velocity jump ',bird.velocity);

})

export const rungame = action(function() {

    start = new Date();

    store.bird = new bird(guid(),60,0)    // new bird object
    store.fgpos = 0
    store.frames = 1
    store.score = 0
    store.pipes = observable([])  //Initalize to empty empty on game start

    game.currentstate= states.Game    // set game state to game


})

//Call to update frame
export const updateFrame = action(function() {

  store.frames++;
  store.fgpos = (store.fgpos - 2) % 14;    // Update fg position
  fg1.cx = store.fgpos;  //Fg is observing the cx position not fgpos
  fg2.cx = store.fgpos + fg_w;

  updateBird(store.bird)

  if (  game.currentstate  === states.Game) {
      updatePipe()
  }
})
