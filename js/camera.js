/* global window */
(function(){
  function Camera(canvas, target, smooth = 0.08){
    this.canvas = canvas;
    this.smooth = smooth;
    this.x = target.x - canvas.width /2;
    this.y = target.y - canvas.height/2;
  }
  Camera.prototype.follow = function(target){
    const tx = target.x - this.canvas.width /2;
    const ty = target.y - this.canvas.height/2;
    this.x += (tx - this.x) * this.smooth;
    this.y += (ty - this.y) * this.smooth;
  };
  window.Camera = Camera;
})();
