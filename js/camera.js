/* global window */
(function () {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} target — qualquer objeto com {x,y}
   * @param {number} smooth  — 0 = câmera rígida, 1 = nunca alcança
   */
  function Camera(canvas, target, smooth = 0.08) {
    this.canvas = canvas;
    this.smooth = smooth;
    this.scale  = 1;                 // 👈 1 = visão distante, 2 = mais perto, 3 = super-zoom
    this.x = target.x - canvas.width  / (2 * this.scale);
    this.y = target.y - canvas.height / (2 * this.scale);
  }

  /** desloca lentamente até manter o alvo no centro */
  Camera.prototype.follow = function (target) {
    const tx = target.x - (this.canvas.width  / this.scale) / 2;
    const ty = target.y - (this.canvas.height / this.scale) / 2;
    this.x += (tx - this.x) * this.smooth;
    this.y += (ty - this.y) * this.smooth;
  };

  /** converte coordenadas do mundo → tela, aplicando escala */
  Camera.prototype.worldToScreen = function (wx, wy) {
    return {
      x: (wx - this.x) * this.scale,
      y: (wy - this.y) * this.scale
    };
  };

  window.Camera = Camera;
})();
