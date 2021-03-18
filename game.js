// LINK WITH HTML CODE
var canvas = document.getElementById("jumpy_bot");
var ctx = canvas.getContext("2d");

// GAME VARS AND CONSTS
let dx = 1;

// LOAD IMAGES
const sprite_bot = new Image();
sprite_bot.src='img/sprite_bot.png';
const img_tap = new Image();
img_tap.src='img/tap.png';

// LOAD SOUNDS
const sound_jump1 = new Audio();
sound_jump1.src = "sound/jump1.wav"
const sound_jump2 = new Audio();
sound_jump2.src = "sound/sec.wav";
const sound_over = new Audio();
sound_over.src = "sound/over.wav";

// INTERACTION WITH USER BY CLICK
canvas.addEventListener("click", function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bot.count++;
            if(bot.count==1){
                sound_jump1.play();
                bot.moove();
            }
            if(bot.count==2){
                sound_jump2.play();
                bot.moove();
            }
            break;
        case state.over:
            let rect = canvas.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            if(clickX>=192 && clickX<=(192+93) && clickY>=(canvas.width/2)+1+5 && clickY<=(canvas.width/2)+25){
                state.current = state.getReady;   
            }
            break;
    }                   
});

// GAME STATE
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over :2
}

// TITLE
const title = {
    x : canvas.width/2,
    draw : function(){
        ctx.textAlign = 'center'; 
        ctx.fillStyle = "#000";
        ctx.font = "50px MinecraftiaRegular";
        if(state.current==state.getReady){
            ctx.fillText("Jumpy Bot", canvas.width/2, canvas.height/3);
        }
        else if(state.current==state.game){
            ctx.fillText("Jumpy Bot", this.x-dx, canvas.height/3);
            this.x -= dx;
            
        }
    }
}

// TAP
const tap = {
    draw : function(){
        if(state.current==state.getReady){
            ctx.drawImage(img_tap, 0, 0, 114, 36, (canvas.width-114)/2, (canvas.height-36)/1.74, 114 , 36);
        }
    }
}

// GAME OVER
const over = {
    draw : function(){
        ctx.textAlign = 'center'; 
        ctx.fillStyle = "#000";
        ctx.font = "50px MinecraftiaRegular";
        if(state.current==state.over){
            ctx.fillText("GAME OVER", canvas.width/2, canvas.height/3);
            ctx.font = "18px MinecraftiaRegular";
            ctx.strokeRect(192,(canvas.width/2)+1+5,93,24);
            ctx.fillText("START", canvas.width/2, canvas.height-59+5);
            
        }
    }
}

// SCORE
const score={
    best : 0,
    value :0,
    draw : function(){
        this.best=Math.max(this.value, this.best);
        ctx.fillStyle = "#000";
        if(state.current==state.game && this.value>=1){
            ctx.textAlign = 'center'; 
            ctx.font = "34px MinecraftiaRegular";
            ctx.fillText(this.value, canvas.width/2, 50);
        }
        if(state.current==state.over){
            ctx.textAlign = 'left'; 
            ctx.font = "28px MinecraftiaRegular";
            ctx.fillText(this.value, canvas.width-200, 170)
            ctx.fillText("SCORE", canvas.width-330, 170)
            ctx.fillText(this.best, canvas.width-200, 205)
            ctx.fillText("BEST", canvas.width-309, 205)          
        }
    }
}


// BOT
const bot = {
    
    // BOT CONSTS
    animation : [
        {sX : 0, sY :0},
        {sX : 0, sY : 74},
        {sX : 65, sY : 0},
        {sX : 130, sY :0}
    ],
    x : 85,
    y : 165,
    w : 65,
    h : 74,
    gap1 : 22,
    gap2 : 21,
    frame : 0,
    frames1 : 0,
    frames2 : 0,
    y1 : canvas.height,
    y2 : canvas.height,
    y3 : canvas.height,
    y4 : canvas.height,
    y5 : canvas.height,
    
    // JUMP CONSTS 
    count : 0, // 0 : NO JUMP, 1 : FIRST JUMP, >1 : SECOND JUMP
    jump : 10,
    gravity : 0.43,
    speed1 : 0,
    speed2 : 0,
    
    // SCORE CONSTS
    key2 : 0,
    key3 : 0,
    key4 : 0,
    key5 : 0,  
    
    // JUMP FUNCTION ACTIVATED WHEN CLICKED
    moove : function(){
        this.speed1 = -this.jump;
        this.speed2 = -this.jump/1.5;
    },
    
    // DRAW FUNCTION OF THE BOT
    draw : function(){
        if(state.current==state.getReady){
            if(this.frames1%120<112){
                this.frame = 0;
            }else{
                this.frame = 1;
            }
            let bot = this.animation[this.frame];
            ctx.drawImage(sprite_bot, bot.sX, bot.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            this.frames1++;
        }
        if(state.current==state.game){
            if(this.count==0){
                if(this.frames2%4==0){
                    this.frame = 2;
                }
                if(this.frames2%4==1){
                    this.frame = 3;
                }
                if(this.frames2%4==2){
                    this.frame = 2;
                }
                if(this.frames2%4==3){
                    this.frame = 0;
                }
                this.speed1 += this.gravity;
                this.y += this.speed1;
            }  
            if(this.count==1){
                this.frame=0;
                this.speed1 += this.gravity;
                this.y += this.speed1;
            }
            if(this.count>=2){
                if(this.frames2%4==0){
                    this.frame = 2;
                }
                if(this.frames2%4==1){
                    this.frame = 3;
                }
                if(this.frames2%4==2){
                    this.frame = 2;
                }
                if(this.frames2%4==3){
                    this.frame = 0;
                }
                this.speed2 += this.gravity;
                this.y += this.speed2;
                
            }    
            if(this.x+this.gap1+this.gap2>platform.x1 && this.x+this.gap1<platform.x1+platform.w1){
                this.y1=Math.min(this.y1,this.y-1);
                if(this.y1+this.h<=platform.y1 && this.y+this.h>platform.y1){
                    this.y=platform.y1-this.h;
                    this.count=0;
                    this.speed1=0;
                    this.speed2=0;
                }
            }
            if(this.x+this.gap1+this.gap2>platform.x2+platform.rx2 && this.x+this.gap1<platform.x2+platform.rx2+platform.w2){
                this.key5=0;
                this.y5=canvas.height;
                this.y2=Math.min(this.y2,this.y-1);
                if(this.y2+this.h<=platform.y1+platform.ry2 && this.y+this.h>platform.y1+platform.ry2){
                    if(this.key2==0){
                        score.value++;
                        this.key2++;
                    }
                    this.y=platform.y1+platform.ry2-this.h;
                    this.count=0;
                    this.speed1=0;
                    this.speed2=0;
                }
            }
            if(this.x+this.gap1+this.gap2>platform.x3+platform.rx3 && this.x+this.gap1<platform.x3+platform.rx3+platform.w2){
                this.key2=0;
                this.y2=canvas.height;
                this.y3=Math.min(this.y3,this.y-1);
                if(this.y3+this.h<=platform.y1+platform.ry3 && this.y+this.h>platform.y1+platform.ry3){
                    if(this.key3==0){
                        score.value++;
                        this.key3++;
                    }
                    this.y=platform.y1+platform.ry3-this.h;
                    this.count=0;
                    this.speed1=0;
                    this.speed2=0;
                }
            }
            if(this.x+this.gap1+this.gap2>platform.x4+platform.rx4 && this.x+this.gap1<platform.x4+platform.rx4+platform.w2){
                this.key3=0;
                this.y3=canvas.height;
                this.y4=Math.min(this.y4,this.y-1);
                if(this.y4+this.h<=platform.y1+platform.ry4 && this.y+this.h>platform.y1+platform.ry4){
                    if(this.key4==0){
                        score.value++;
                        this.key4++;
                    }
                    this.y=platform.y1+platform.ry4-this.h;
                    this.count=0;
                    this.speed1=0;
                    this.speed2=0;
                }
            }
            if(this.x+this.gap1+this.gap2>platform.x5+platform.rx5 && this.x+this.gap1<platform.x5+platform.rx5+platform.w2){
                this.key4=0;
                this.y4=canvas.height;
                this.y5=Math.min(this.y5,this.y-1);
                if(this.y5+this.h<=platform.y1+platform.ry5 && this.y+this.h>platform.y1+platform.ry5){   
                    if(this.key5==0){
                        score.value++;
                        this.key5++;
                    }
                    this.y=platform.y1+platform.ry5-this.h;
                    this.count=0;
                    this.speed1=0;
                    this.speed2=0;
                }
            }
            if(this.speed2>0){
                this.frame=0;
            }
            if(this.y>=canvas.height){
                sound_over.play();
                state.current=state.over;
            }
            let bot = this.animation[this.frame];
            ctx.drawImage(sprite_bot, bot.sX, bot.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            this.frames2++;
        }   
    }
}

// PLATFORM
const platform = {
    w1 : 440,
    w2 : 135,
    h : 5,
    y1 : 239,
    x1 : 20,
    key : 0,
    
    draw : function(){
        if(state.current==state.getReady){
            ctx.fillRect(this.x1,this.y1,this.w1,this.h);
        }
        if(state.current==state.game){
            // SPEED OF THE GAME
            if(bot.frames2==1){
                dx=2;
            }
            if(bot.frames2==2){
                dx=3;
            }
            if(bot.frames2==3){
                dx=4;
            }
            if(bot.frames2==4){
                dx=5;
            }
            if(bot.frames2==200){
                dx=6;
            } 
            if(bot.frames2==500){
                dx=7;
            }  
            if(bot.frames2%1000==0){
                dx++;
            }
            // INITIALISATION CONSTS
            if(this.key==0){
                this.x2 = canvas.width+20; this.rx2 = Math.random()*120; this.ry2 = (Math.random()-0.5)*120;
                this.x3 = this.x2+this.rx2+this.w2+40; this.rx3 = Math.random()*120; this.ry3 = (Math.random()-0.5)*120;
                this.x4 = this.x3+this.rx3+this.w2+40; this.rx4 = Math.random()*120; this.ry4 = (Math.random()-0.5)*120;
                this.x5 = this.x4+this.rx4+this.w2+40 ;this.rx5 = Math.random()*120; this.ry5 = (Math.random()-0.5)*120;
                this.key++;
            }
            // DRAWING PLATFORMS
            if(this.x1+440 >=0){
                ctx.fillRect(this.x1-dx,this.y1,this.w1,this.h);
            }
            if(this.x2+this.rx2+this.w2 > 0){
                ctx.fillRect(this.x2+this.rx2-dx,this.y1+this.ry2,this.w2,this.h);
            }else{
                this.ry2 = (Math.random()-0.5)*120;
                this.rx2 = Math.random()*120;
                this.x2=this.x5+this.rx5+this.w2+40;
            }
            if(this.x3+this.rx3+this.w2 > 0){
                ctx.fillRect(this.x3+this.rx3-dx,this.y1+this.ry3,this.w2,this.h);
            }else{
                this.ry3 = (Math.random()-0.5)*120;
                this.rx3 = Math.random()*120;
                this.x3=this.x2+this.rx2+this.w2+40;
            }
            if(this.x4+this.rx4+this.w2 > 0){
                ctx.fillRect(this.x4+this.rx4-dx,this.y1+this.ry4,this.w2,this.h);
            }else{
                this.ry4 = (Math.random()-0.5)*120;
                this.rx4 = Math.random()*120;
                this.x4=this.x3+this.rx3+this.w2+40;
            }
            if(this.x5+this.rx5+this.w2 > 0){
                ctx.fillRect(this.x5+this.rx5-dx,this.y1+this.ry5,this.w2,this.h);
            }else{
                this.ry5 = (Math.random()-0.5)*120;
                this.rx5 = Math.random()*120;
                this.x5=this.x4+this.rx4+this.w2+40;
            }
            this.x1 -= dx;
            this.x2 -= dx;
            this.x3 -= dx;
            this.x4 -= dx;
            this.x5 -= dx; 
        }        
    }
}

function reset(){
    if(state.current==state.getReady){
            score.value=0;
    }
    if(state.current==state.over){
        dx=1;
        title.x = canvas.width/2;
        bot.x = 85;
        bot.y = 165;
        bot.frame = 0;
        bot.frames1 = 0;
        bot.frames2 = 0;
        bot.y1 = canvas.height;
        bot.y2 = canvas.height;
        bot.y3 = canvas.height;
        bot.y4 = canvas.height;
        bot.y5 = canvas.height;
        bot.count = 0;
        bot.jump = 10;
        bot.gravity = 0.43;
        bot.speed1 = 0;
        bot.speed2 = 0;      
        bot.key2 = 0;
        bot.key3 = 0;
        bot.key4 = 0;
        bot.key5 = 0;  
        platform.x1 = 20;
        platform.key = 0;
    }
}

// DRAW
function draw(){
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    title.draw();
    tap.draw();
    platform.draw();
    bot.draw();
    score.draw();
    over.draw();   
}

// LOOP (MOTOR)
function loop(){
    draw(); 
    reset();
    requestAnimationFrame(loop);
}
loop();
