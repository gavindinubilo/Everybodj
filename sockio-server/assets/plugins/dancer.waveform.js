/*
 * Waveform plugin for dancer.js
 *
 * var dancer = new Dancer('song.ogg'),
 *     canvas = document.getElementById('waveform');
 * dancer.waveform( canvas, { strokeStyle: '#ff0077' });
 */

(function() {
  Dancer.addPlugin( 'waveform', function( canvasEl, options ) {

  hexToRGB = function(hex){
    var r = hex >> 16;
    var g = hex >> 8 & 0xFF;
    var b = hex & 0xFF;
    return [r,g,b];
  };
  var time = 0;
	var d = document,
      w       = canvasEl.width,
			cos = Math.cos,
			sin = Math.sin,
			PI = Math.PI;
	CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
	  if (w < 2 * r) r = w / 2;
	  if (h < 2 * r) r = h / 2;
	  this.beginPath();
	  this.moveTo(x+r, y);
	  this.arcTo(x+w, y,   x+w, y+h, r);
	  this.arcTo(x+w, y+h, x,   y+h, r);
	  this.arcTo(x,   y+h, x,   y,   r);
	  this.arcTo(x,   y,   x+w, y,   r);
	  this.closePath();
	  return this;
	};
	function average(waves) {
		var total = 0;
		for (var i = 0; i < waves.length; i++) {
			total += Math.abs(waves[i]);
		}
		return total / waves.length;
	}
    options = options || {};
    var
      ctx     = canvasEl.getContext( '2d' ),
      h       = canvasEl.height,
      width   = options.width || 2,
      spacing = options.spacing || 0,
      count   = options.count || 1024;

    ctx.lineWidth   = options.strokeWidth || 3;
    ctx.strokeStyle = options.strokeStyle || "white";
    ctx.fillStyle = options.strokeStyle || "white";

    this.bind( 'update', function() {
      var waveform = this.getWaveform();
      switch(this.wave) {
        case 0:
          var color = hexToRGB(this.bgColor.slice(1));
          ctx.fillStyle = "rgba("+color[0]+ ","+color[1]+","+color[2]+",0.05)";
					ctx.fillRect(0,0,w,h);
          ctx.beginPath();
          ctx.moveTo( 0, h / 2 );
          for ( var i = 0, l = waveform.length; i < l && i < count; i++ ) {
            ctx.lineTo( i * ( spacing + width ), ( h / 2 ) + waveform[ i ] * ( h / 2 ));
          }
          ctx.stroke();
          ctx.closePath();
          break;
        case 1:
				color = hexToRGB(this.bgColor.slice(1));
     ctx.fillStyle = "rgba("+color[0]+ ","+color[1]+","+color[2]+",0.05)";
					ctx.fillRect(0,0,w,h);
          for (i = 0, l = waveform.length; i < 300 && i < count; i++ ) {
            ctx.beginPath();
            ctx.arc(w/4, h/2, Math.abs(waveform[i]) * (h/2), 0, 2 * Math.PI, false);
            // ctx.fill();
            ctx.stroke();
            ctx.closePath();
          }
          break;
        case 2:
          color = hexToRGB(this.bgColor.slice(1));
          ctx.fillStyle = "rgba("+color[0]+ ","+color[1]+","+color[2]+",0.05)";
					ctx.fillRect(0,0,w,h);
          ctx.fillStyle = "hsl(" + (360 * average(waveform)) + ",100%, 50%)";
          for (i = 0; i < waveform.length; i++ ){
              // ctx.fillStyle = "hsl(" + (360*waveform[i]) + ",100%, 50%)";
              ctx.fillRect(i,h- (Math.abs( waveform[i] * h)),1,h);
          }
          break;
				case 3:
					color = hexToRGB(this.bgColor.slice(1));
          ctx.fillStyle = "rgba("+color[0]+ ","+color[1]+","+color[2]+",0.05)";
          ctx.fillRect(0,0,w,h);
					// ctx.fillStyle = 'rgba(0,255,255,.5)';
					// ctx.globalCompositeOperation = 'lighter';
					time += 0.1;

					// The number of particles to generate
					i = 10000;

					while( i-- ) {
						// The magic
						r = ( ( w ) * waveform[i] ) * ( cos( ( time + i ) * ( 0.05 + ( ( sin(time*0.00002) / PI ) * 0.2 ) ) ) / PI );
            ctx.fillStyle = ctx.strokeStyle;
						ctx.fillRect( sin(i) *  r + (Math.random() * (w - 100)),
										  cos(i) * r + (h),
										  3,
										  3 );
					}
					i = 0;
				break;
			}
    });

    return this;
  });
})();
