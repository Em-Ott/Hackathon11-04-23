const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.height=576;
canvas.width=1024;
c.fillRect(0,0,canvas.width,canvas.height);

class backGround{
    constructor({position, imageSrc}){
        this.position=position
        this.width=canvas.width
        this.height=canvas.height
        this.image=new Image()
        this.image.src=imageSrc
    }
    draw(){
        c.drawImage(this.image,this.position.x,this.position.y)
    }
    updateArt(){
        this.draw()
    }
}
const backgroundImage = new backGround({
    position:{
        x:0,
        y:0
    }, imageSrc:'hackathonbackground.png'});

class Sprite {
    constructor({position, velocity, color="blue", height=150, width=75}){
        this.position = position
        this.velocity = velocity
        this.height=height
        this.width=width
        this.color=color
        this.health=100
    };

    draw() {
        if (this.health>0){
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)}
    }
    update(){
        this.position.x+=this.velocity.x
        checkForAttack();
        }
    updateArt(){
        this.draw()
    }
};

const keys ={
    a:{
        pressed:false
    },
    d:{
        pressed:false
    }
};

let playerStatus = 'noAction'
let level = 1
centerText=document.getElementById('levelBox')
mobSlain = 0

const player = new Sprite ({
    position:{x:75, 
        y:canvas.height-150},
    velocity:{x:0, 
        y:0}
});

const attackBox = new Sprite({
    position: {x:player.position.x+65,
    y:player.position.y},
    velocity:{x:0,y:0},
    color:'red',
    height: player.height,
    width: 100,
    health: player.health
});

const mobGreen = new Sprite({
    position:{x:canvas.width-75, y:canvas.height-75},
    velocity:{x:-3, y:0},
    color:'green',
    height:75,
    width:75
});
const playerHealthBar = new Sprite ({
    position:{x:player.position.x-12.5, y:player.position.y-30},
    velocity:{x:player.velocity.x, y:player.velocity.y},
    color:'yellow',
    height: 10,
    width: 100,
    health: player.health
});
const mobGreenHealthBar = new Sprite ({
    position: {x:mobGreen.position.x-12.5, y:mobGreen.position.y-30},
    velocity: {x:mobGreen.velocity.x, y:mobGreen.velocity.y},
    color: 'yellow',
    height: 10,
    width: 100,
    health: mobGreen.health
});
const emptyHPPlayer = new Sprite ({
    position:{x:player.position.x-12.5, y:player.position.y-30},
    velocity:{x:player.velocity.x, y:player.velocity.y},
    color:'blue',
    height: 10,
    width: 100,
    health: player.health
});
const emptyHPMob = new Sprite ({
    position: {x:mobGreen.position.x-12.5, y:mobGreen.position.y-30},
    velocity: {x:mobGreen.velocity.x, y:mobGreen.velocity.y},
    color: 'blue',
    height: 10,
    width: 100,
    health: mobGreen.health
});

function checkForAttack(){
    if ((attackBox.position.x+attackBox.width>=mobGreen.position.x)
        &&(playerStatus==='attack')
        && player.health>0
        && mobGreen.health>0){
        mobGreen.health-=50
        mobGreenHealthBar.health=mobGreen.health
        mobGreenHealthBar.width-=50
        playerStatus='noAction'
        if(mobGreen.health<=0){
            setTimeout(mobRespawn,2000)
            emptyHPMob.health=0
            //different sprite for mob death
        }
        //if statement where depending on stage and number of mob deaths either next stage or mob respawn
    };
    if(mobGreen.position.x>=player.position.x
        && mobGreen.position.x<=player.position.x+player.width
        && mobGreen.health>0
        && player.health>0){
        player.health-=20
        mobGreen.health=0
        mobGreenHealthBar.health=0
        emptyHPMob.health=0
        playerHealthBar.width-=20
            //different sprite for mob success
        if (player.health<=0){
            //sprite for player death
            emptyHPPlayer.health=0
            attackBox.health=0
        }else setTimeout(mobRespawn, 2000)
    };}

function mobRespawn(){
    mobGreen.health=100
    mobGreen.position.x=canvas.width-75
    mobGreen.velocity.x=-3
    mobGreenHealthBar.health=100
    mobGreenHealthBar.position.x=mobGreen.position.x-12.5
    mobGreenHealthBar.velocity.x=mobGreen.velocity.x
    mobGreenHealthBar.width=100
    emptyHPMob.health=100
    emptyHPMob.position.x=mobGreen.position.x-12.5
};

function animate(){
    window.requestAnimationFrame(animate)
    backgroundImage.updateArt();
    player.updateArt();
    attackBox.update();
    player.update();
    emptyHPPlayer.update();
    emptyHPPlayer.updateArt();
    emptyHPMob.update();
    emptyHPMob.updateArt();
    mobGreen.update();
    mobGreen.updateArt();
    playerHealthBar.update();
    mobGreenHealthBar.update();
    playerHealthBar.updateArt();
    mobGreenHealthBar.updateArt();
    if (keys.d.pressed && player.position.x<canvas.width-player.width){
        player.velocity.x=5
        attackBox.velocity.x=5
        playerHealthBar.velocity.x=5
        emptyHPPlayer.velocity.x=5
    }else if (keys.a.pressed && player.position.x>0){
        player.velocity.x=-5
        attackBox.velocity.x=-5
        playerHealthBar.velocity.x=-5
        emptyHPPlayer.velocity.x=-5
    }else player.velocity.x=0 
    
    if (player.velocity.x===0){
        attackBox.velocity.x=0
        playerHealthBar.velocity.x=0
        emptyHPPlayer.velocity.x=0
    }
    if (playerStatus==='attack'){
        attackBox.updateArt();
        playerStatus='noAction'
    };
};

animate();


window.addEventListener('keydown', (event)=>{
    switch (event.key){
        case 'd':
            keys.d.pressed=true
        break
        case 'a':
            keys.a.pressed=true
        break
    }
});
window.addEventListener('keyup', (event)=>{
    switch(event.key){
        case'd':
            keys.d.pressed=false
        break
        case 'a':
            keys.a.pressed=false
        break
        case ' ':
            playerStatus = 'attack'
        break
    }
});
