function Entity(world, name) {
    this.name = name || 'Entity';
    this.world = world;
    this.components = {};
    this.update = undefined;
    this.draw = undefined;
}

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

var objects;
var world;

var layout = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];


var init = function() {
  objects = [];
  world = {
    width: 300,
    height: 250,
    mouse: {
      x: 100,
      y: 125
    }
  };

  game.tiles = 0;

  var tile;
  for(var col = 0; col < layout.length; col++) {
    for(var row = 0; row < layout[col].length; row++) {
      if(layout[col][row]) {
        tile = new Entity(world, 'Block');

        tile.size = {
          x: 20,
          y: 10
        };

        tile.state = 'normal';

        tile.position = {
          x: row * tile.size.x + tile.size.x/2,
          y: col * tile.size.y + tile.size.x/2
        };

        tile.draw = function () {
          if(this.state == 'normal')
            ctx.fillStyle = 'rgb(218,165,32)';
          else
            ctx.fillStyle = 'rgb(255,255,255)';

          ctx.fillRect(this.position.x - this.size.x/2, this.position.y - this.size.y/2, this.size.x, this.size.y);

          ctx.strokeStyle = 'rgb(255,255,255)';
          ctx.strokeRect(this.position.x - this.size.x/2, this.position.y - this.size.y/2, this.size.x, this.size.y);
        };

        tile.update = function() {
          if(this.state == 'normal') {
            var distXSquared = (ball.position.x - this.position.x) * (ball.position.x - this.position.x);
            var distYSquared = (ball.position.y - this.position.y) * (ball.position.y - this.position.y);

            var sizeXSquared = this.size.x * this.size.x / 4;
            var sizeYSquared = this.size.y * this.size.y / 4;


            if(sizeXSquared > distXSquared && sizeYSquared > distYSquared) {
              if(distXSquared/sizeXSquared == distYSquared/sizeYSquared) {
                ball.velocity.x *= -1;
                ball.velocity.y *= -1;
              } else if(distXSquared/sizeXSquared > distYSquared/sizeYSquared) {
                ball.velocity.x *= -1;
              }
              else {
                ball.velocity.y *= -1;
              }

              game.tiles--;
              this.state = 'destroyed';
            }


          }
        };

        objects.push(tile);
        game.tiles++;
      }
    }
  }

  var ball = new Entity(world, 'Ball');

  ball.size = 2.5;
  ball.velocity = {
    x: 0.01,
    y: 0.99
  };

  ball.position = {
    x: 100,
    y: 125
  };

  ball.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);

    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fill();
  };

  ball.update = function() {
    // Game over if the ball goes out the bottom
    if(this.position.y > world.height) {
      game.end();
      return;
    }

    if(this.position.x > world.width || this.position.x < 0) {
      this.velocity.x *= -1;
    }

    if(this.position.y < 0) {
      this.velocity.y *= -1;
    }

    var paddleLeft = paddle.position.x - paddle.size.x/2;
    var paddleRight = paddle.position.x + paddle.size.x/2;
    if(this.position.y > paddle.position.y && this.position.y < (paddle.position.y + paddle.size.y) && this.position.x > paddleLeft && this.position.x < paddleRight) {
      var distXSquared = (this.position.x - paddle.position.x) * (this.position.x - paddle.position.x);

      var sign = (this.position.x - paddle.position.x) >= 0 ? 1 : -1;

      if(distXSquared > (3 * paddle.size.x / 8)*(3 * paddle.size.x / 8)) {
        this.velocity.x = 0.75 * sign;
        this.velocity.y = -0.25;
      } else if(distXSquared < (paddle.size.x / 8)*(paddle.size.x / 8)) {
        this.velocity.y *= -1;
      } else {
        this.velocity.x = 0.25 * sign;
        this.velocity.y = -0.75;
      }
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  };

  var paddle = new Entity('Paddle', world);
  paddle.size = {
    x: 50,
    y: 10
  };

  paddle.velocity = {
    x: 1,
    y: 0.2
  };

  paddle.position = {
    x: 10,
    y: 200
  };

  paddle.draw = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.position.x - this.size.x/2, this.position.y + this.size.y);
    ctx.lineTo(this.position.x - this.size.x/2 + this.size.x/8, this.position.y + this.size.y/2);
    ctx.lineTo(this.position.x - this.size.x/2 + 3*this.size.x/8, this.position.y);
    ctx.lineTo(this.position.x - this.size.x/2 + 5*this.size.x/8, this.position.y);
    ctx.lineTo(this.position.x - this.size.x/2 + 7*this.size.x/8, this.position.y + this.size.y/2);
    ctx.lineTo(this.position.x - this.size.x/2 + this.size.x, this.position.y + this.size.y);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fill();
  };

  paddle.update = function() {
    this.position.x = world.mouse.x;
  };


  // Add ball and paddle to game objects array
  objects.push(ball);
  objects.push(paddle);
};






var game = {
  status: null,
  state: 'ready',
  tiles: 0,
  start: function() {
    // If game is already running, then return
    if(game.state == 'running') return;

    init();
    game.state = 'running';
    game.update();

    setTimeout(function() {
      game.status = window.setInterval(game.update, 1);
    }, 1000);
  },
  update: function() {
    ctx.clearRect(0,0,500,500);

    if(game.state == 'running') {
      for(var i = 0; i < objects.length; i++) {
        if(objects[i].update) objects[i].update();
        objects[i].draw(ctx);
      }
    }
    // Are there no tiles left then we won!
    if(game.tiles === 0) game.state = 'win';

    if(game.state == 'lose' || game.state == 'win') {
      window.clearInterval(game.status);

      if(game.state == 'win') {
        ctx.fillStyle = 'rgba(0,255,0,0.25)';
      } else {
        ctx.fillStyle = 'rgba(255,0,0,0.25)';
      }

      ctx.fillRect(0,0,500,500);

      game.state = 'ready';
    }
  },
  end: function() {
    game.state = 'lose';
  }
};

document.getElementById('game').onclick = game.start;

// Track mouse position
canvas.addEventListener('mousemove', function(e) {
  if(world) {
    world.mouse.x = e.pageX - e.target.offsetLeft;
    world.mouse.y = e.pageY - e.target.offsetTop;
  }
});