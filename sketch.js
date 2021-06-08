var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudPos;
var cloudGroup, cloud, cloudImage;

var obstacleGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;

var playState = true;

var score = 0;

var jumpSound;
var dieSound;
var cpSpound;

var gameOver, gameOverImg;
var restart, restartImg;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  jumpSound = loadSound("jump.mp3"); 
  dieSound = loadSound("die.mp3");
  cpSound = loadSound("checkPoint.mp3");  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  
}


function setup() {
  createCanvas(600, 200);

  //create a trex sprite
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("Collided", trex_collided);
  trex.scale = 0.5;
  
  //trex.debug = true;
  trex.setCollider("circle", 0, 0, 40);

  //create a ground sprite
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  

  //creating invisible ground
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;
  invisibleGround.shapeColor = "green";
  obstacleGroup = new Group();
  cloudGroup = new Group();
  
  gameOver = createSprite(300, 80, 10, 10);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.scale = 0.4;
  
  restart = createSprite(300, 120, 10, 10);
  restart.addImage("restart", restartImg);
  restart.scale = 0.5;
  
}


function draw() {
  //set background color
  background(180);
  
  fill("white");
  
  text("Score: " + score, 300, 20);

  if (playState === true) {
    
    gameOver.visible = false;
    restart.visible = false;
    
    score += Math.round(getFrameRate()/60);

    if (score>0 && score%100 === 0) {
        
        cpSound.play();
        
    }
    ground.velocityX = -(4 + 3*score/100);

    
    // jump when the space key is pressed
    if (keyDown("space") && trex.y >= 161) {
      jumpSound.play();
      trex.velocityY = -13;
    }

    trex.velocityY = trex.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }


    //Spawn Clouds
    spawnClouds();
    //Spawn Obstacles
    spawnObstacles();
    
    if (trex.isTouching(obstacleGroup)) {
        
        dieSound.play();
        playState = false;
        
    }
    
  } else {
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    trex.changeAnimation("Collided", trex_collided);
    score = 0;
    
    gameOver.visible = true;
    restart.visible = true;
    
    if (mousePressedOver(restart)) {
        
        playState = true;
        score = 0; 
        obstacleGroup.destroyEach();
        cloudGroup.destroyEach(); 
        trex.changeAnimation("running", trex_running);
    }
    
  }
  
    //stop trex from falling down
    trex.collide(invisibleGround);

  drawSprites();
}


//function to spawn the clouds
function spawnClouds() {
  if (frameCount % 100 === 0) {
    cloud = createSprite(640, 30, 30, 10);
    cloud.addImage("cloud", cloudImage);
    cloudPos = Math.round(random(40, 120));
    cloud.velocityX = -cloudPos / 40;
    cloud.y = cloudPos;
    cloud.scale = cloudPos / 130;
    trex.depth = cloud.depth + 1;
    cloud.lifetime = width / -cloud.velocityX;
    
    cloudGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 120 === 0) {
    var obstacle = createSprite(630, 165, 10, 40);
    
    obstacle.velocityX = -(4 + 3*score/100);

    // //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    obstacleGroup.add(obstacle);
    
  }
}