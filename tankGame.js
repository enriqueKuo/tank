ZoneMgr = function(){
    this.zoneList = [] ;
} ;
ZoneMgr.prototype.add = function(zone) {
    var length = this.zoneList.length ;
    for(var i = 0; i < length ;i++){
	    if( ( (zone.x ==this.zoneList[i].x) && (zone.y ==this.zoneList[i].y))==true){
		    return false;
		}
	}
	this.zoneList.push(zone) ;
	return true ;
} ;
ZoneMgr.prototype.getCurZone = function(x,y) {
    var length = this.zoneList.length ;
    for(var i = 0; i < length ;i++){
	    if( this.zoneList[i].contains(x,y)){
		    return this.zoneList[i];
		}
	}
	return null ;
} ;

/*JoyStick = function (newOptions) {
    this.options = newOptions;
    this.defaultOptions = {
        phaser: null, //an instance of Phaser
        assetKey: '', //the asset's key
        x: 0, //x position
        y: 0, //y position
        dragType: '', //type of drag movement allowed
        bounds: null //an instance of a Phaser Rectangle
    };
 
    this.joyStick = null;
    this.initCursorPositionX = null;
    this.initCursorPositionY = null;
    this.lockedAxis = false;
};
JoyStick.prototype.init = function() {
    //create the sprite
    this.joyStick = this.options.phaser.add.sprite(this.options.x, this.options.y, 'arcade',this.options.assetKey);
 
    //enable input
    this.joyStick.inputEnabled = true;
 
    //change the cursor to the hand version on hover
    this.joyStick.input.useHandCursor = true;
 
    //enable drag
    this.joyStick.input.enableDrag(false, true);
 
    //restrict dragging within the Phaser rectangle (in our case it covers the whole visible screen)
    this.joyStick.input.boundsRect = this.options.bounds;
 
    //restrict dragging movement based on selected drag type
    switch (this.options.dragType) {
        case 'horizontal':
            this.joyStick.input.setDragLock(true, false);
            break;
        case 'vertical':
            this.joyStick.input.setDragLock(false, true);
            break;
        case 'both':
            this.joyStick.events.onDragUpdate.add(this.dragUpdate, this);
            this.joyStick.events.onDragStop.add(this.dragStop, this);
            break;
    }
};
JoyStick.prototype.dragUpdate = function() {
    //if we already locked to either axis, then exit
    if(this.lockedAxis) {
        return false;
    }
 
    //if we don't have a record of the initial cursor's position when it started dragging, grab one and exit
    if(this.initCursorPositionX === null || this.initCursorPositionY === null) {
        this.initCursorPositionX = this.options.phaser.input.x;
        this.initCursorPositionY = this.options.phaser.input.y;
        return false;
    }
 
    //calculate the absolute difference between the initial cursor position and the current one for both axis
    var differenceX = Math.abs(this.initCursorPositionX - this.options.phaser.input.x);
    var differenceY = Math.abs(this.initCursorPositionY - this.options.phaser.input.y);
 
    //allow at least one of the axis to move 5 pixels before restricting movement to either
    if(differenceX < 5 && differenceY < 5) {
        return false;
    }
 
    //if the cursor moved a greater distance in X-axis than in Y-axis, then restrict dragging horizontally
    if(differenceX > differenceY) {
        this.joyStick.y = this.options.y;
        this.joyStick.input.setDragLock(true, false);
        this.lockedAxis = true;
        return false;
    }
 
    //alternatively, restrict dragging vertically
    this.joyStick.x = this.options.x;
    this.joyStick.input.setDragLock(false, true);
    this.lockedAxis = true;
};
 
//reset values and store new X & Y coordinates
JoyStick.prototype.dragStop = function() {
    this.initCursorPositionX = null;
    this.initCursorPositionY = null;
    this.joyStick.x = this.options.x;
    this.joyStick.y = this.options.y;
    this.lockedAxis = false;
};*/

var game = new Phaser.Game(viewWidth, viewHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update,render:render });

function preload() {
	//game
	game.load.atlas('tank', 'assets/tanks/tanks.png', 'assets/tanks/tanks.json');
	game.load.image('bullet', 'assets/tanks/bullet.png');
	game.load.image('earth', 'assets/tanks/scorched_earth.png');
	game.load.image('ground', 'assets/tanks/wall3.png');
	game.load.image('hay', 'assets/tanks/meadow.png');
	//ui
	game.load.spritesheet('button', 'assets/ui/flixelButton.png', 80, 20);
	game.load.atlas('arcade', 'assets/ui/arcade-joystick.png', 'assets/ui/arcade-joystick.json');
}

var platforms;
var cursors;
var keySpace;
var pad ;
var padWidth = 280 ;
var padHeight = 280 ;
var stick ;
var stickX ;
var stickY ;
var stickWidth = 134;
var stickHeight = 134 ;
var bounce ;
//==========
//hay
//==========
var hays ;
var hayLife = 100 ;
var hayWidth = 64 ;
var hayHeight = 64 ;
//==========
//tank
//==========
var tank ;
var turret;
var bullets;
var fireRate = 200;
var nextFire = 0;
var currentSpeed = 0;
var playerAcceleration ;
var playerVelocity ;
var acc = 200 ;
var attackPower = 25 ;
//==========
//color
//==========
var btnRed ;
var btnBlue ;
var btnGreen ;
var btnChangeColor = [btnRed,btnBlue,btnGreen];
var btnText = ['Red','Blue','Green'] ;
var red = 0xCC0000 ;
var blue = 0x0066FF ;
var green = 0xFFFFFF ;
var colors = ['#FF0000','#0000FF','#00AA00'] ;
//==========
//map
//==========
var land;
var viewWidth = 800 ;
var viewHeight = 600 ;
var wallWidth = 512 ;
var wallHeight = 55 ;
var rangeOffset = 10 ;
var rangeOffset2 = 20 ;
var bCollide = false ;
//==========
//zone
//==========
var curRandomList = [] ;
var zMgr = new ZoneMgr() ;
var curZone ;
var zCount = 3 ;
var zoneHayCount = 5 ;
var zoneWallCount = 3 ;
var zoneRoundCount = 9 ;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
	
	land = game.add.tileSprite(0, 0, viewWidth, viewHeight, 'earth');
    //land.fixedToCamera = true;
	
    platforms = game.add.group();
    platforms.enableBody = true;
	hays = game.add.group();
    hays.enableBody = true;
	
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	ground.body.setSize(ground.width-rangeOffset*2, ground.height-rangeOffset*2,rangeOffset,rangeOffset);
    ground.body.immovable = true;
	
	curZone = new Phaser.Rectangle(0,0,viewWidth,viewHeight) ;
	zMgr.add(curZone) ;
	var i = 0; 
	var x = curZone.x-curZone.width ;
	var y = curZone.y-curZone.height ;
	for(i = 0; i < zoneRoundCount; i++){
	    if(i==5){
		    continue ;
		}
	    var idx = Math.floor(i % zCount);
        var idy = Math.floor(i / zCount);
	    var zone = new Phaser.Rectangle(x+idx*viewWidth, y+idy*viewHeight, viewWidth, viewHeight) ;
	    zMgr.add(zone) ;
	}
    var ledge = platforms.create(400, 400, 'ground');
	ledge.body.setSize(ledge.width-rangeOffset*2, ledge.height-rangeOffset*2,rangeOffset,rangeOffset);
    ledge.body.immovable = true;
    ledge = platforms.create(-200, 250, 'ground');
	ledge.body.setSize(ledge.width-rangeOffset*2, ledge.height-rangeOffset*2,rangeOffset,rangeOffset);
    ledge.body.immovable = true;
	
	var hay = hays.create(300, 100, 'hay');
	hay.body.setSize(hay.width-rangeOffset2*2, hay.height-rangeOffset2*2,rangeOffset2,rangeOffset2);
    hay.body.immovable = true;
	hay.life = 100 ;

	//tank code start
	//Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
	
	tank = game.add.sprite((game.width-64)/2, (game.height-64)/2, 'tank', 'tank1');
    tank.anchor.setTo(0.5, 0.5);
    tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
    game.physics.arcade.enable(tank);
	//tank.tint = red;
    //  This will force it to decelerate and limit its speed
    //game.physics.enable(tank, Phaser.Physics.ARCADE);
    //tank.body.drag.set(0.2);
    //tank.body.maxVelocity.setTo(400, 400);
    //tank.body.collideWorldBounds = true;

    //  Finally the turret that we place on-top of the tank body
    turret = game.add.sprite(200, 200, 'tank', 'turret');
    turret.anchor.setTo(0.3, 0.5);
	
	game.camera.follow(tank);
    //game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    //game.camera.focusOnXY(0, 0);

	//==============================================
	//input
	//==============================================
    cursors = game.input.keyboard.createCursorKeys();
	keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	keySpace.onDown.add(fire, this);
	
	pad = game.add.sprite(0, viewHeight-padHeight, 'arcade', 'base');
	/*var bounds = new Phaser.Rectangle(0, pad.y, padWidth, padHeight);
	stick = new JoyStick({
        phaser: game,
        assetKey: 'stick',
        x: (padWidth-stickWidth)/2,
        y: viewHeight-stickHeight-(padHeight-stickHeight)/2,
        bounds: bounds
    }) ;
	stick.init() ;*/
	stickX = (padWidth-stickWidth)/2 ;
	stickY = viewHeight-stickHeight-(padHeight-stickHeight)/2 ;
	stick = game.add.sprite(stickX, stickY, 'arcade', 'stick');
	stick.inputEnabled = true;
    stick.input.enableDrag(true);
	stick.events.onDragStart.add(onDragStart, this);
    stick.events.onDragUpdate.add(onDragUpdate, this);
    stick.events.onDragStop.add(onDragStop, this);
	//==============================================
	for(i = 0;i<3;i++){
	    var text = game.add.text(10, 2, btnText[i], { fontSize: '12px', fill: colors[i] });
	    btnChangeColor[i] = game.add.button(16, 16+i*20, 'button', actionOnClick, this, 2, 1, 0);
        btnChangeColor[i].onInputOver.add(over, this);
        btnChangeColor[i].onInputOut.add(out, this);
        btnChangeColor[i].onInputUp.add(up, this);
		btnChangeColor[i].name = btnText[i] ;
		btnChangeColor[i].addChild(text) ;
	}
	bounce = new Phaser.Circle(padWidth/2, pad.y+padHeight/2,padWidth);
}

function update() {
	game.physics.arcade.overlap(bullets, platforms, bulletHitWall, null, this);
	game.physics.arcade.overlap(bullets, hays, bulletHitHay, null, this);
	
	bCollide = false ;
	playerAcceleration = new Phaser.Point(0, 0);
    playerVelocity = new Phaser.Point(0, 0);
	if (stick.input.isDragged)
	{
        //this.physics.arcade.velocityFromRotation(this.stick.rotation, this.stick.force * maxSpeed, this.sprite.body.velocity);
		game.physics.arcade.accelerationFromRotation(tank.rotation, acc, playerAcceleration);
    } 
	else//鍵盤控制
	{
	    if (cursors.left.isDown)
        {
            tank.angle -= 4;
        }
        else if (cursors.right.isDown)
        {
            tank.angle += 4;
        }
        
        if (cursors.up.isDown)
        {
            //  The speed we'll travel at
            //currentSpeed = 300;
	    	game.physics.arcade.accelerationFromRotation(tank.rotation, acc, playerAcceleration);
        }
	    else if (cursors.down.isDown)
        {
            //  The speed we'll travel at
            //currentSpeed = 300;
	    	game.physics.arcade.accelerationFromRotation(tank.rotation, -acc, playerAcceleration);
        }
        else
        {
	        playerAcceleration.set(0);
            /*if (currentSpeed > 0)
            {
                currentSpeed -= 4;
            }*/
        }
	}
	if (currentSpeed > 0)
    {
        //game.physics.arcade.accelerationFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
    }
	game.physics.arcade.collide(tank, platforms, collisionHandler,null,this);
	game.physics.arcade.collide(tank, hays, collisionHandler,null,this);
    playerVelocity.x += playerAcceleration.x;
    playerVelocity.y += playerAcceleration.y;
    //land.tilePosition.x = -game.camera.x;
    //land.tilePosition.y = -game.camera.y;
    land.tilePosition.x -= playerVelocity.x * this.game.time.physicsElapsed;
    land.tilePosition.y -= playerVelocity.y * this.game.time.physicsElapsed;
	platforms.x -= playerVelocity.x * this.game.time.physicsElapsed;
	platforms.y -= playerVelocity.y * this.game.time.physicsElapsed;
	hays.x -= playerVelocity.x * this.game.time.physicsElapsed;
	hays.y -= playerVelocity.y * this.game.time.physicsElapsed;
	detectZoneChange(hays.x,hays.y) ;
    //Position all the parts and align rotations
    //shadow.x = tank.x;
    //shadow.y = tank.y;
    //shadow.rotation = tank.rotation;
    turret.x = tank.x;
    turret.y = tank.y;
    turret.rotation = tank.rotation ;//game.physics.arcade.angleToPointer(turret);
	
	if(game.input.activePointer.isDown)
    {
        fire();
    }
}
function changeColor(color){
    tank.tint = color;
	turret.tint = color;
}
function collisionHandler(obj1, obj2) {
    playerAcceleration.x = -playerAcceleration.x*5;
	playerAcceleration.y = -playerAcceleration.y*5;
}
function render() {
  //game.debug.cameraInfo(game.camera, 32, 32);
  //game.debug.spriteInfo(tank, 32, 32);
}
//==============================================================================================
//event
//==============================================================================================
function onDragStart(){
}
function onDragUpdate(){
    if(bounce.contains(game.input.x, game.input.y)==false){
		onDragStop() ;
	}else{
		//playerAcceleration = new Phaser.Point(0, 0);
        //playerVelocity = new Phaser.Point(0, 0);
		tank.rotation = game.math.angleBetweenPoints({x:stickX,y:stickY}, {x:stick.x, y:stick.y}) ;
		/*game.physics.arcade.accelerationFromRotation(tank.rotation, acc, playerAcceleration);
		playerVelocity.x += playerAcceleration.x;
        playerVelocity.y += playerAcceleration.y;
        land.tilePosition.x -= playerVelocity.x * this.game.time.physicsElapsed;
        land.tilePosition.y -= playerVelocity.y * this.game.time.physicsElapsed;
	    platforms.x -= playerVelocity.x * this.game.time.physicsElapsed;
	    platforms.y -= playerVelocity.y * this.game.time.physicsElapsed;
	    hays.x -= playerVelocity.x * this.game.time.physicsElapsed;
	    hays.y -= playerVelocity.y * this.game.time.physicsElapsed;
	    detectZoneChange(hays.x,hays.y) ;*/
	}
}
function onDragStop(){
	stick.x = stickX ;
	stick.y = stickY ;
}
function up() {
    console.log('button up', arguments);
}

function over() {
    console.log('button over');
}

function out() {
    console.log('button out');
}

function actionOnClick (obj) {
    var color = 0xFFFFFF;
    if(obj.name=='Green'){
	    color = green ;
		attackPower = 25 ;
	}else if(obj.name=='Red'){
	    color = red ;
		attackPower = 10 ;
	}else if(obj.name=='Blue'){
	    color = blue ;
		attackPower = 20 ;
	}
    changeColor(color) ;
}

function fire () {
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);
        bullet.rotation = tank.rotation ;
        //bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
		game.physics.arcade.velocityFromRotation(tank.rotation,1000,bullet.body.velocity) ;
    }

}
//==============================================================================================
function hitTest(x,y,width,height){
    var length = curRandomList.length ;
	var hit = false ;
    for(var i = 0; i < length ;i++){
	    hit =curRandomList[i].body.hitTest(x,y) || curRandomList[i].body.hitTest(x+width,y) ||
		curRandomList[i].body.hitTest(x,y+height) || curRandomList[i].body.hitTest(x+width,y+height) ;
	}
	return hit ;
}
function randomCreate(zone){
    var i = 0 ;
	for(i = 0; i < zoneWallCount; i++){
        var point = zone.random() ;
		if( ( (point.x+wallWidth)>=(zone.x+zone.width) ) ||( (point.y+wallHeight)>=(zone.y+zone.height) ) ){
		    continue ;
		}
	    randomCreateWall(point.x, point.y) ;
	}
	for(i = 0; i < zoneHayCount; i++){
	    var point = zone.random() ;
		if( ( (point.x+hayWidth)>=(zone.x+zone.width) ) ||( (point.y+hayHeight)>=(zone.y+zone.height) ) ){
		    continue ;
		}
	    randomCreateHay(point.x, point.y) ;
	}
}
function randomCreateHay(x,y){
	if(hitTest(x,y,hayWidth,hayHeight)==false){
	    var hay = hays.create(x, y, 'hay');
	    hay.body.setSize(hay.width-rangeOffset2*2, hay.height-rangeOffset2*2,rangeOffset2,rangeOffset2);
        hay.body.immovable = true;
	    hay.life = 100 ;
		curRandomList.push(hay) ;
	}
}
function randomCreateWall(x,y){
	if(hitTest(x,y,wallWidth,wallHeight)==false){
        var ground = platforms.create(x, y, 'ground');
	    ground.body.setSize(ground.width-rangeOffset*2, ground.height-rangeOffset*2,rangeOffset,rangeOffset);
        ground.body.immovable = true;
		curRandomList.push(ground) ;
	}
}
function bulletHitWall (bullet, wall) {
    bullet.kill();
}
function bulletHitHay (bullet, hay) {
    bullet.kill();
	hay.life-=attackPower ;
	if(hay.life<=0){
	    hay.kill() ;
	}
}
function detectZoneChange(x,y){
    if(typeof(curZone)=='undefined'){
	    return ;
	}
    x = -x ;
	y = -y ;
    if( (x>(curZone.x+viewWidth))||((x+viewWidth)<curZone.x)||
	(y>(curZone.y+viewHeight)) || ((y+viewHeight)<curZone.y) ){
	    changeZone(x,y) ;
	}
}
function changeZone(x,y){
    var zone = zMgr.getCurZone(x+viewWidth/2,y+viewHeight/2) ;
	var bRandom = false ;
	if(zone!=null){
	    curZone = zone ;
		curRandomList = [] ;
		var strX = curZone.x-viewWidth ;
		var strY = curZone.y-viewHeight ;
		var testCount = 0 ;
	    for(i = 0; i < zoneRoundCount; i++){
	        if(i==5){
	    	    continue ;
	    	}
	        var idx = Math.floor(i % zCount);
            var idy = Math.floor(i / zCount);
	        var zone = new Phaser.Rectangle(strX+idx*viewWidth, strY+idy*viewHeight, viewWidth, viewHeight) ;
	        bRandom = zMgr.add(zone) ;
			if(bRandom==true){
			    randomCreate(zone) ;
				testCount++ ;
			}
	    }
		console.log(testCount) ;
	}
}