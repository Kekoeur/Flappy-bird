export var width = window.innerWidth-2;
export var height = window.innerHeight-2;

/*if (width >= 500) { //if this desktop
  width  = 320;
  height = 480;
  var ratio_w = 1;
  var ratio_h = 1;
} else {*/
  var ratio_w = width/320;
  var ratio_h = height/480;
//}

export var ratio = {ratio_h: ratio_h, ratio_w: ratio_w}
