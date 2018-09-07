// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Evolutionary "Steering Behavior" Simulation

// An array of vehicles
var population = [];

// An array of "food"
var food = [];

// How good is food, how bad is poison?
var nutrition = [0.1, -1];

var bullets = [];

// Show additional info on DNA?
var debug;

function setup() {

  // Add canvas and grab checkbox
  var canvas = createCanvas(800, 600);
  canvas.parent('canvascontainer');
  debug = select('#debug');


  // Create 10 vehicles
  angleMode(RADIANS);
  for (var i = 0; i < 1; i++) {
    population[i] = new Vehicle(width / 2, height / 2);
  }
  // Start with some food
  for (var i = 0; i < 10; i++) {
    food[i] = createVector(random(width), random(height));
  }

}

// Add new vehicles by dragging mouse
function mouseClicked() {
  population.push(new Vehicle(mouseX, mouseY));
}

function draw() {
  background(0);

  // 10% chance of new food
  if (random(1) < 0.01) {
    food.push(createVector(random(width), random(height)));
  }

  // Go through all vehicles
  for (var i = population.length - 1; i >= 0; i--) {
    var v = population[i];

    // Eat the food (index 0)
    v.eat(food, 0);

    var bullet = v.shoot(population, bullets);

    // Check boundaries
    v.boundaries();

    // Update and draw
    v.update();
    v.display();

    // If the vehicle has died, remove
    if (v.dead()) {
      console.log(v.id + " Died");
      population.splice(i, 1);
    } else {
      // Every vehicle has a chance of cloning itself
      var child = v.birth();
      if (child != null) {
        //population.push(child);
      }
    }
  }

  // Draw all the food
  for (var i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 4);
  }

  for (var i = bullets.length -1; i >=0 ; i--) {
    var curBullet = bullets[i];
    curBullet.update();
    if(curBullet.doHit(population)){
      bullets.splice(i, 1);
      continue;
    }

    if(curBullet.velocity.mag() == 0){
      bullets.splice(i, 1);
      continue;
    }

    if(curBullet.outOfBounds()){
      bullets.splice(i, 1);
      continue;
    }
    curBullet.display();

  }




}
