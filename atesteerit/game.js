var canvas = $("<canvas id='canvas' width='320' height='240'></canvas>");

var mousex = 160,
    mousey = 120;

var finished = false;

var score = 0,
    coinslost = 0;

canvas.appendTo('#center');

var ctx = canvas.get(0).getContext("2d");

var keydown = [];

for(var i=0; i<128; i++)
{
  keydown[i] = false;
}

setInterval(function(){
  update();
  draw();
}, 1000/60);

setInterval(function(){
  if(Math.random()>0.7)
  {
  addCoin();
  }
}, 1000/30);

var player = {
  x: 32,
  y: 120,
  width: 60,
  height: 38,
  yspeed: 0
};

var gravity = .5;

function draw()
{
  if (finished==false)
  {
  ctx.clearRect(0,0,320,240);
  
  coins.forEach(function(coin){
    if (coin.active)
    {
    coin.draw();
    }
  });

      
  var pcordx = player.x-(player.width/2);
  var pcordy = player.y-(player.height/2);

  var kimg=document.getElementById("kazan");

  ctx.drawImage(kimg, pcordx, pcordy);
  
  
  ctx.fillStyle = "black";
  ctx.fillText("Bunları erittik: " + score, 2, 10);
  ctx.fillText("Kalanlar: " + coinslost, 2, 22);
  }
  else
  {
    ctx.clearRect(0,0,320,240);
    ctx.fillText("Nerdeyse bitti! Samandıra'dan ve Maltepe'den gelen " + finishedcoins + " avro kaldı!", 5, 120);
  }
  
}

var finishedcoins;
  
function update()
{
  if (finished)
  {
    exit;
  }
  if (score>=100)
  {
    finished = true;
    finishedcoins = coinslost;
  }
  gravity+=.5;
  player.y += gravity;
  player.y -= player.yspeed;
  
  if (player.y>240-16)
  {
    gravity = 0;
    player.yspeed = 0;
    player.y=240-16;
  }
  
  coins.forEach(function(coin){
    if(coin.active)
    {
    coin.update();
    }
  });
  
  if (keydown[32])
  {
    if (gravity==0)
    {
      player.yspeed = 10;
    }
  }
  
}

var coins = [];

function addCoin()
{
  var coin = {
    active: true,
    x: Math.random()*320,
    y: -16,
    width: 27,
    height: 50,
    gravity: 0.5,
    draw: function(){
      
      var cordx = this.x;
      var cordy = this.y;
      
      var img=document.getElementById("euro");

      ctx.drawImage(img, cordx, cordy);

      
    },
    
    update: function(){
     
      this.gravity+=.5;
      this.y+=this.gravity;
      
      if (this.gravity>3)
      {
        this.gravity = 3;
      }
      
      if(collides(this,player))
      {
        score++;
        this.active = false;
      }
      
      if(this.y>240)
      {
        this.active = false;
        coinslost++;
      }
      
    }
  };
  
  coins.push(coin);
  
}

$(document).keypress(function(event){
  keydown[event.which] = true;
});

$(document).keyup(function(event){
  keydown[event.which] = false;
});

function collides(a, b) {
  
  if(b==player)
  {
    b = {

      x: player.x-16,
      y: player.y-16,
      width: player.width,
      height: player.height
    }
  }
  
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

$('#canvas').mousedown(function(e){
  if (gravity==0)
    {
      player.yspeed = 12;
    }
  
  addCoin();
});

$("#canvas").mousemove(function(e){

  mousex = e.pageX-this.offsetLeft;  
  mousey = e.pageY-this.offsetTop;
  
  player.x = e.pageX-this.offsetLeft;
  
});