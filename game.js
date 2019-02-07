var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById("canvas-id");
canvas.width = innerWidth;
canvas.height = innerHeight;
var context = canvas.getContext("2d");

var player={x:canvas.width/2,y:canvas.height/2,ax:0,ay:0,speed:0.4,mode:0,kills:0,life:100};
var enemies = [];
var bullets =[];
var particles =[];
var cheat=[];

var keyA=0,keyS=0,keyD=0,keyW=0;
var mouseX=0,mouseY=0;

var rapidfire = false;
var start=false;
var gameover=false;
var win = false;
var pause = false;
var boss=true;
var score=0;
var bulletsFired=0;
var bulletsHit=0;
var wave = 1;
var bonus=0;

var loadedIMG=false;
var hart = new Image();
hart.src = "hart.png";
hart.onload = function(){loadedIMG=true;}

function isThereABoss(){
	var r=false;
	for (var a =0;a<enemies.length;a++){
		if (enemies[a].type==4){r=true;break;}
	}
	return r;
}
function randcol(){
return "rgb("+Math.floor(Math.random()*100+155)+","+Math.floor(Math.random()*100 +155)+","+Math.floor(Math.random()*100+155)+")";
}
function shoot(){
	if (player.mode == 3){setTimeout(uslessFunction,100);}
	fire(mouseX,mouseY);
	if (player.mode==4){shotgun();}
}
function uslessFunction(){
fire(mouseX,mouseY);
}
function dist(x,y){
return Math.sqrt(x*x+y*y);
}
function boom(x,y,cl){
var ww=Math.floor(Math.random()*10+10);
	for (var a =0;a<ww;a++){
	explode(x,y,cl);

	}
}
function shotgun(){
var dx=player.x-mouseX;
var dy=player.y-mouseY;

var cos1 = Math.cos(3.2);
var sin1 = Math.sin(3.2);
var cos2 = Math.cos(-3.2);
var sin2 = Math.sin(-3.2);

var x1 = cos1*dx-sin1*dy + player.x;
var y1 = cos1*dy+sin1*dx + player.y;
var x2 = cos2*dx-sin2*dy + player.x;
var y2 = cos2*dy+sin2*dx + player.y;

fire(x1,y1);
fire(x2,y2);
}
function rapid(){
if (!pause && rapidfire && !gameover){shoot();}
setTimeout(rapid,100);
}
function restart(){
player.life=100;
player.mode=0;
player.kills=0;
enemies = [];
win = false;
score = 0;
bonus=0;
rapidfire=false;
boss=true;
start=true;
wave = 1;
gameover=false;
loopwaves();
}
function loopwaves(){
	if (!pause){waves();}
	if(!gameover){setTimeout(loopwaves,500);}
}

function waves(){
	if (wave == 1 && player.kills<10){ //1 Intro
		if (enemies.length<3){spawn(0);}
		return;
	}
	if (wave == 1 && enemies.length==0){wave ++;}

	if (wave == 2 && player.kills<40){ //2 2xIntro
		if (enemies.length<7){spawn(0);}
		return;
	}
	if (wave == 2 && enemies.length==0){wave ++;}
	
	if (wave == 3 && player.kills<55){ //3 Intro na Lilavi (+ cherveni)
		if (enemies.length<7){
			if(Math.random()>0.7){
				spawn(1);
			}
			else{
				spawn(0);
			}
		}
		return;
	}
	if (wave == 3 && enemies.length==0){wave ++;}
		
	if (wave == 4 && player.kills<90){ //4 Cherveni i lilavi
		if (enemies.length<10){
			if(Math.random()>0.5){
				spawn(1);
			}
			else{
				spawn(0);
			}
			
		}
		return;
	}
	if (wave == 4 && enemies.length==0){wave ++;}
	
	if (wave == 5 && player.kills<120){ //5 Roqk julti
		if (enemies.length<15){spawn(3);}
		return;
	}
	if (wave == 5 && enemies.length==0){wave ++;}
	
	if (wave == 6 && player.kills<150){ //6 Intro na sini
		if (enemies.length<10){
			if(Math.random()>0.7){
				spawn(0)
			}
			else{
				spawn(2);
			}
		}
		return;
	}
	if (wave == 6 && enemies.length==0){wave ++;}
	
	if (wave == 7 && player.kills<180){ //7 Sini i Lilavi
		if (enemies.length<10){
			if(Math.random()>0.5){
				spawn(1);
			}
			else{
				spawn(2);
			}
			
		}
		return;
	}
	if (wave == 7 && enemies.length==0){wave ++;}
	
	if (wave == 8 && player.kills<210){ //8 Cherveni i julti
		if (enemies.length<15){
		    /*var r=Math.random();
			if(r<0.33){
				spawn(3);
			}
			else if (r<0.66){
				spawn(0);
			}
			else{
				spawn(2);
			}*/
			spawn(0)?Math.random()>0.5:spawn(3);
		}
		return;
	}
	if (wave == 8 && enemies.length==0){wave ++;}
	
	if (wave == 9 && player.kills<230){ //9  Roqk julti
		if (enemies.length<20){spawn(3);}
		return;
	}
	if (wave == 9 && enemies.length==0){wave ++;}
	if (wave == 10 && !isThereABoss() && !boss){gameover=true;win=true;}
	
	if (wave == 10){ //BOSS
		if (boss){
			boss=false;
			spawn(4);
		}
		if (Math.random()<0.5){spawn(Math.floor(Math.random()*4))}
		return;
	}

}

function spawn(type){
	var x,y;
	{
	if (Math.random()>0.5){
		x = Math.random()>0.5?canvas.width+10:-10;
		y = Math.random()*canvas.height;
	}
	else{
		y=Math.random()>0.5?canvas.height+10:-10;
		x=Math.random()*canvas.width;
	}
	}
	if (type == 0){//norm
		enemies.push({ //normalni
				x:x,
				y:y,
				type:type,
				speed:Math.random()+2,
				color:"rgb(255,0,0)"
		});
	}
	if (type == 1){//lilavi
		enemies.push({ // po prava liniq
				x:x,
				y:y,
				type:type,
				speed:3,
				color:"rgb(209,100,254)"
		});
	}
	if (type == 2){//sini
		var fog;
		if (x==-10){
			if (Math.random()>0.5){fog=1;}
			else{fog=2;}
		}
		if (y==-10){
			if (Math.random()>0.5){fog=2;}
			else{fog=3;}
		}
		if (x==canvas.width+10){
			if (Math.random()>0.5){fog=3;}
			else{fog=4;}
		}
		if (y==canvas.height+10){
			if (Math.random()>0.5){fog=4;}
			else{fog=1;}
		}
		enemies.push({ // diagonali
				x:x,
				y:y,
				ax:0,
				ay:0,
				fog:fog,
				type:type,
				speed:4,
				color:"rgb(0,255,255)"
		});
	}
	if (type == 3){//jilti
		enemies.push({ // bikove
				x:x,
				y:y,
				type:type,
				tx:player.x,
				ty:player.y,
				speed:Math.random()+7,
				color:"rgb(200,200,0)"
		});
	}
	if (type == 4){//boss
		enemies.push({ //BOSS
				x:x,
				y:y,
				life:300,
				type:type,
				speed:2,
				color:"rgb(255,255,200)"
		});
		
	}
}
function fire(x,y){
	bulletsFired++;
	if (bonus >0){bonus --;}
	var dx=player.x-x;
	var dy=player.y-y;
	var angle=Math.atan2(dx,dy);
	var ax = -Math.sin(angle);
	var ay = -Math.cos(angle);
	var color;
	if (player.mode == 0){color= "#FFF";}
	if (player.mode == 1){color = "#0FF";}
	if (player.mode == 2){color = "#00F";}
	if (player.mode == 3){color = "#FF0";}
	if (player.mode == 4){color = "#0F0";}
	bullets.push({
		life:Math.random()*60+40,
		x:player.x,
		y:player.y,
		type:player.mode,
		ax:ax*6,
		ay:ay*6,
		color:color,
		bounce:2
	});
}
function explode(x,y,cl){
	particles.push({
	x:x,
	y:y,
	color:cl,
	size:Math.random()*10+5,
	ax:(Math.random()*4-2),
	ay:(Math.random()*4-2),
	life:Math.random()*0.5+0.5
	});
}

window.addEventListener("keydown", function (args) {
    t=args.keyCode;
	if (t == 65){keyA=true;}
	else if (t == 68){keyD=true;}
	else if (t == 83){keyS=true;}
	else if (t == 87){keyW=true;}
	else if (t == 80){pause=!pause;}
	else if (gameover && t == 70){restart();}
	else if (t == 70 && !start){loopwaves();start=true;}
	if (cheat.length>=8){cheat.shift();}
	cheat.push(t);
}, false);
window.addEventListener("keyup", function (args) {
	t=args.keyCode;
	if (t == 65){keyA=false;}
	else if (t == 68){keyD=false;}
	else if (t == 83){keyS=false;}
	else if (t == 87){keyW=false;}
}, false);
window.addEventListener("mousemove", function (args) {
mouseX=args.layerX;
mouseY=args.layerY;
}, false);
window.addEventListener("mousedown", function (args) {
	shoot();
	if (pause){pause=false;}
}, false);

function update() {
if (pause == false){
	{//player
	if (keyA){player.ax-=player.speed;}
	if (keyD){player.ax+=player.speed;}
	if (keyS){player.ay+=player.speed;}
	if (keyW){player.ay-=player.speed;}
	
	if (player.x+10>canvas.width){player.x=canvas.width-10;player.ax*=-1;}
	if (player.x-10<0){player.x=10;player.ax*=-1;}
	
	if (player.y+10>canvas.height){player.y=canvas.height-10;player.ay*=-1;}
	if (player.y-10<0){player.y=10;player.ay*=-1;}
	
	player.ax*=0.95;
	player.ay*=0.95;
	
	player.x+=player.ax;
	player.y+=player.ay;
	
	if(cheat.toString()=="84,79,76,85,77,66,65,83" && !rapidfire){rapidfire=true;rapid();console.log("CHEAT MODE ACTIVATED!")}
	if(player.life<100){player.life+=0.06;}
	if(bonus == 0){player.mode = 0;}
	}
	{//bullets
	for (var a=0;a<bullets.length;a++){
		bullets[a].x+=bullets[a].ax;
		bullets[a].y+=bullets[a].ay;
		bullets[a].life--;
		if (win && bullets[a].life<0){
			boom(bullets[a].x,bullets[a].y,randcol());
			bullets.splice(a,1);
			continue;
		}
		if (bullets[a].type == 1 && bullets[a].bounce>0){
			if (bullets[a].x>canvas.width-5){bullets[a].x=canvas.width-5;bullets[a].ax*=-1;bullets[a].bounce--;}
			if (bullets[a].x<5){bullets[a].x=5;bullets[a].ax*=-1;bullets[a].bounce--;}
			if (bullets[a].y>canvas.height-5){bullets[a].y=canvas.height-5;bullets[a].ay*=-1;bullets[a].bounce--;}
			if (bullets[a].y<5){bullets[a].y=5;bullets[a].ay*=-1;bullets[a].bounce--;}
		}
		else if (bullets[a].x>canvas.width || bullets[a].x<0 || bullets[a].y<0 || bullets[a].y>canvas.height){bullets.splice(a,1);}
	}
	}                                                                                                                                                          
	{//enemies
	for (var a =0;a<enemies.length;a++){
		if (enemies[a].type == 0){  //cherveni
			var dx=player.x-enemies[a].x;
			var dy=player.y-enemies[a].y;
			var angle = Math.atan2(dx,dy);
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);
			enemies[a].x+=sin*enemies[a].speed;
			enemies[a].y+=cos*enemies[a].speed;
		}
		if (enemies[a].type == 1){ //Lilanvi
			var dx=player.x-enemies[a].x;
			var dy=player.y-enemies[a].y;
			if (dx>3){enemies[a].x+=enemies[a].speed;}
			if (dx<-3){enemies[a].x-=enemies[a].speed;}
			if (dy>3){enemies[a].y+=enemies[a].speed;}
			if (dy<-3){enemies[a].y-=enemies[a].speed;}

		}
		if (enemies[a].type == 2){ // sini
			var dx=enemies[a].x-player.x;
			var dy=player.y-enemies[a].y;
			if (!(dx>dy+10) && !(dy>dx+10) && (dx >= 0 && dy >=0)){enemies[a].fog=3;}
			if (!(dx>-dy+10) && !(-dy>dx+10)&& (dx >= 0 && dy <0)){enemies[a].fog=4;}
			if (!(-dx>dy+10) && !(dy>-dx+10)&& (dx < 0 && dy >=0)){enemies[a].fog=2;}
			if (!(-dx>-dy+10) && !(-dy>-dx+10)&& (dx < 0 && dy <0)){enemies[a].fog=1;}
			
			switch(enemies[a].fog){
				case 1:
					enemies[a].x+=enemies[a].speed;
					enemies[a].y-=enemies[a].speed;
					break;
				case 2:
					enemies[a].x+=enemies[a].speed;
					enemies[a].y+=enemies[a].speed;
					break;
				case 3:
					enemies[a].x-=enemies[a].speed;
					enemies[a].y+=enemies[a].speed;
					break;
				case 4:
					enemies[a].x-=enemies[a].speed;
					enemies[a].y-=enemies[a].speed;
					break;
			}
			
			if (enemies[a].x < 10){
				if (enemies[a].fog==4){enemies[a].fog=1;}
				if (enemies[a].fog==3){enemies[a].fog=2;}
			}
			if (enemies[a].y < 10){
				if (enemies[a].fog==4){enemies[a].fog=3;}
				if (enemies[a].fog==1){enemies[a].fog=2;}
			}
			if (enemies[a].x > canvas.width-10){
				if (enemies[a].fog==1){enemies[a].fog=4;}
				if (enemies[a].fog==2){enemies[a].fog=3;}
			}
			if (enemies[a].y > canvas.height-10){
				if (enemies[a].fog==2){enemies[a].fog=1;}
				if (enemies[a].fog==3){enemies[a].fog=4;}
			}
		}
		if (enemies[a].type == 3){ //julti
			var dx=enemies[a].tx-enemies[a].x;
			var dy=enemies[a].ty-enemies[a].y;
			var angle = Math.atan2(dx,dy);
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);
			enemies[a].x+=sin*enemies[a].speed;
			enemies[a].y+=cos*enemies[a].speed;
			if (dist(dx,dy)<10){enemies[a].tx=player.x;enemies[a].ty=player.y}
		
		}
		if (enemies[a].type == 4){ // boss
			var dx=player.x-enemies[a].x;
			var dy=player.y-enemies[a].y;
			var angle = Math.atan2(dx,dy);
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);
			enemies[a].x+=sin*enemies[a].speed;
			enemies[a].y+=cos*enemies[a].speed;
		}
	}
	if (gameover){
		for(var a =0;a<enemies.length;a++){
		boom(enemies[a].x,enemies[a].y,enemies[a].color);
		}
		enemies=[];
	}
	}
	{//colision bullets/enemies
		for (var a=0;a<bullets.length;a++){
			for (var b=0;b<enemies.length;b++){
				var dx=bullets[a].x-enemies[b].x;
				var dy=bullets[a].y-enemies[b].y;
				if (dist(dx,dy)<15 || (enemies[b].type==4 && dist(dx,dy)<105)){
					boom(bullets[a].x,bullets[a].y,enemies[b].color);
					player.kills++;
					if (Math.random()*100<3 && player.mode == 0 && enemies[b].type!=4){player.mode = Math.floor(Math.random()*4)+1;bonus = 50+Math.floor(Math.random()*30)}
					if (bullets[a].type!=2 && enemies[b].type!=4){
						bullets.splice(a,1);
					}
					if (enemies[b].type!=4 ||(enemies[b].type==4 && enemies[b].life<=0)){enemies.splice(b,1);}
					else{enemies[b].life--;}
					score+=100;
					bulletsHit++;
					break;
				}
			}
		}
	}
	{//player colision
	for (var a =0;a<enemies.length;a++){
	var dx=enemies[a].x-player.x;
	var dy=enemies[a].y-player.y;
	if (dist(dx,dy)<20 || (dist(dx,dy)<110 && enemies[a].type==4)){
		if (enemies[a].type!=4)boom(enemies[a].x,enemies[a].y,enemies[a].color);
		enemies.splice(a,1);
		player.life-=20;
		if (score >=50){score-=50;}else{score=0;}
		context.fillStyle="rgba(255,0,0,0.2)";
		context.fillRect(0,0,canvas.width,canvas.height);
		}
	}
	if (player.life<=0){gameover=true;}
	}
	{//particles
	for (var a=0;a<particles.length;a++){
		particles[a].life-=0.01;
		if (particles[a].life<=0){particles.splice(a,1);continue;}
		particles[a].x+=particles[a].ax*particles[a].life;
		particles[a].y+=particles[a].ay*particles[a].life;
	}
	}}
	setTimeout(update, 10);
}

function draw() {
if (!pause){ //cls
	context.fillStyle = "rgba(0,0,0,0.2)";
	context.fillRect(0,0,canvas.width,canvas.height)
    
	
	if (!start){ //START
	context.font = ""+canvas.width*0.1+"px Courier New"
	context.fillStyle="#FAA"
	context.fillText("KAMIKAZE",canvas.width*0.27,canvas.height*0.2);
	
	context.font = ""+canvas.width*0.02+"px Courier New";
	context.fillStyle="rgba(200,200,200,0.5)";
	context.fillText("WASD to move, P to pause, mouse to shoot, F to start",canvas.width*0.20,canvas.height*0.3);
	
	context.fillText("By Anton",canvas.width*0.45,canvas.height*0.9);
	}
	else if (!gameover){//IN GAME
	context.font = ""+canvas.width*0.05+"px Courier New";
	context.fillStyle="rgba(200,200,200,0.5)";
	context.fillText("wave",canvas.width*0.445,canvas.height*0.14);
	
	var text = wave;//wave
	if (text<10){context.fillText(text,canvas.width*0.49,canvas.height*0.2);}
	else if (text<100){context.fillText(text,canvas.width*0.485,canvas.height*0.2);}
	else if (text<1000){context.fillText(text,canvas.width*0.48,canvas.height*0.2);}
	else {context.fillText(text,canvas.width*0.47,canvas.height*0.2);}
	
	var text = score;//score
	if (text<10){context.fillText(text,canvas.width*0.49,canvas.height*0.85);}
	else if (text<100){context.fillText(text,canvas.width*0.475,canvas.height*0.85);}
	else if (text<1000){context.fillText(text,canvas.width*0.46,canvas.height*0.85);}
	else if (text<10000){context.fillText(text,canvas.width*0.445,canvas.height*0.85);}
	else {context.fillText(text,canvas.width*0.43,canvas.height*0.85);}
	
	}
	else if(!win){ // YOU LOSE
	context.font = ""+canvas.width*0.05+"px Courier New";
	context.fillStyle="#FFF"
	context.fillText("GAME OVER",canvas.width*0.37,canvas.height*0.2);
	
	context.font = ""+canvas.width*0.02+"px Courier New";
	context.fillStyle="rgba(200,200,200,0.5)";
	context.fillText("press F to try again",canvas.width*0.39,canvas.height*0.3);
	
	context.fillText("your score:"+score,canvas.width*0.42,canvas.height*0.7);
	}
	else{ // YOU WIN
	context.font = ""+canvas.width*0.15+"px Courier New";
	context.fillStyle="#FF3"
	context.fillText("YOU WIN!",canvas.width*0.21,canvas.height*0.4);
	
	context.font = ""+canvas.width*0.02+"px Courier New";
	context.fillStyle="rgba(200,200,200,0.5)";
	context.fillText("press F to try again, shoot for fireworks",canvas.width*0.30,canvas.height*0.7);
	context.fillText("your score:"+score,canvas.width*0.42,canvas.height*0.5);
	}
	
	{//LIFE BAR
	context.fillStyle="F33";
	if (player.life>0){context.fillRect(50,20,(canvas.width-100)*(player.life/100),10);}//life
	if(loadedIMG){context.drawImage(hart, 10, 10,30,30);}
	}
	
	{//player
	context.fillStyle = "#0F0"; 
	context.beginPath();
	context.arc(player.x,player.y,10,0,2*Math.PI);
	context.fill();
	}
	
	for (var a=0;a<bullets.length;a++){
	context.fillStyle = bullets[a].color;
	context.beginPath();
	context.arc(bullets[a].x,bullets[a].y,5,0,2*Math.PI);
	context.fill();
	}
	
	for (var a=0;a<enemies.length;a++){
	context.fillStyle = enemies[a].color;
	context.beginPath();
	if (enemies[a].type!=4){
	context.arc(enemies[a].x,enemies[a].y,10,0,2*Math.PI);
	}
	else{
	context.arc(enemies[a].x,enemies[a].y,100,0,2*Math.PI);
	}
	context.fill();
	}
	
	for (var a=0;a<particles.length;a++){
		context.globalAlpha = particles[a].life;
		context.fillStyle = particles[a].color;
		context.beginPath();
		context.arc(particles[a].x,particles[a].y,particles[a].size,0,2*Math.PI);
		context.fill();
	}
	context.globalAlpha = 1;
}
requestAnimationFrame(draw);
}
update();
draw();