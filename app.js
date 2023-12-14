function initCanvas(){
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage   = new Image(); 
    var enemiespic1  = new Image(); 
    var enemiespic2 = new Image(); 

    backgroundImage.src = "images/espacio.jpg"; 
    naveImage.src       = "images/amlo.png"; 
    enemiespic1.src     = "images/peña.png";
    enemiespic2.src     = "images/anaya.png"; 
    
    var cW = ctx.canvas.width;
    var cH = ctx.canvas.height;

    var enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

    var enemies = [
        new enemyTemplate({id: "enemy1", x: 100, y: -20, w: 50, h: 30 }),
        new enemyTemplate({id: "enemy2", x: 225, y: -20, w: 50, h: 30 }),
        new enemyTemplate({id: "enemy3", x: 350, y: -20, w: 80, h: 30 }),
        new enemyTemplate({id: "enemy4", x:100,  y:-70,  w:80,  h: 30}),
        new enemyTemplate({id: "enemy5", x:225,  y:-70,  w:50,  h: 30}),
        new enemyTemplate({id: "enemy6", x:350,  y:-70,  w:50,  h: 30}),
        new enemyTemplate({id: "enemy7", x:475,  y:-70,  w:50,  h: 30}),
        new enemyTemplate({id: "enemy8", x:600,  y:-70,  w:80,  h: 30}),
        new enemyTemplate({id: "enemy9", x:475,  y:-20,  w:50,  h: 30}),
        new enemyTemplate({id: "enemy10",x: 600, y: -20, w: 50, h: 30}),
        new enemyTemplate({ id: "enemy11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemy12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemy13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
        new enemyTemplate({ id: "enemy14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
        new enemyTemplate({ id: "enemy15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemy16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemy17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemy18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2 }),
        new enemyTemplate({ id: "enemy19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "enemy20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2 })
    ];

    var addNewEnemiesInterval = setInterval(function () {
        addNewEnemies();
    }, 2000);  // Agrega nuevos enemigos cada 2 segundos

    function addNewEnemies() {
        for (var i = 0; i < 5; i++) {
            var newEnemy = new enemyTemplate({
                id: "enemy" + (enemies.length + 1),
                x: Math.floor(Math.random() * cW),  // Posición x aleatoria dentro del ancho del canvas
                y: -20,  // Posición y inicial
                w: 50,   // Ancho
                h: 30,   // Altura
                image: Math.random() < 0.5 ? enemiespic1 : enemiespic2 // Imagen aleatoria
            });

            enemies.push(newEnemy);
        }
    }

    var renderEnemies = function (enemyList) {
        for (var i = 0; i < enemyList.length; i++) {
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

    function Launcher(){
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,   
        this.direccion, 
        this.bg="white",
        this.misiles = [];

         this.gameStatus = {
            over: false, 
            message: "",
            fillStyle: 'red',
            font: 'italic bold 36px Arial, sans-serif',
        }

        this.render = function () {
            if(this.direccion === 'left'){
                this.x-=5;
            } else if(this.direccion === 'right'){
                this.x+=5;
            }else if(this.direccion === "downArrow"){
                this.y+=5;
            }else if(this.direccion === "upArrow"){
                this.y-=5;
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10);
            ctx.drawImage(naveImage,this.x,this.y, 100, 90);

            for(var i=0; i < this.misiles.length; i++){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h);
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0){
                    this.misiles.splice(i,1);
                }
            }

            if (enemies.length === 0) {
                clearInterval(animateInterval);
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.font;
                ctx.fillText('Ganaste :0', cW * .5 - 80, 50);
            }
        }

        this.hitDetect = function (m, mi) {
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
                if(m.x+m.w >= e.x && 
                   m.x <= e.x+e.w && 
                   m.y >= e.y && 
                   m.y <= e.y+e.h){
                    this.misiles.splice(this.misiles[mi],1);
                    enemies.splice(i, 1);
                    document.querySelector('.barra').innerHTML = "Enemigos destruidos "+ e.id+ " ";
                }
            }
        }

        this.hitDetectLowerLevel = function(enemy){
            if(enemy.y > 550){
                this.gameStatus.over = true;
                this.gameStatus.message = 'Ya pasaron bro!';
            }

            if(enemy.id === 'enemy3'){
                console.log(this.x);
            }

            if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) {
                    this.gameStatus.over = true;
                    this.gameStatus.message = 'Moriste jaja'
                }

            if(this.gameStatus.over === true){  
                clearInterval(animateInterval);
                ctx.fillStyle = this.gameStatus.fillStyle;
                ctx.font = this.gameStatus.font;
                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50);
            }
        }
    }
    
    var launcher = new Launcher();
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }
    var animateInterval = setInterval(animate, 6);
    
    var fire_btn  = document.getElementById('fire_btn'); 
    var isMouseDown = false;

    document.addEventListener('mousemove', function (event) {
        launcher.x = event.clientX - ctx.canvas.getBoundingClientRect().left - launcher.w * 0.5;
        launcher.y = event.clientY - ctx.canvas.getBoundingClientRect().top - launcher.h * 0.5;
    });

    document.addEventListener('mousedown', function (event) {
        if (event.button === 0) {
            isMouseDown = true;
        }
    });

    document.addEventListener('mouseup', function (event) {
        if (event.button === 0) {
            isMouseDown = false;
        }
    });

    fire_btn.addEventListener('mousedown', function(event) {
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
    });

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 70) {
           launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
        }
    });
}
window.addEventListener('load', function(event) {
    initCanvas();
});
