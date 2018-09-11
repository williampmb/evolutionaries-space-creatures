var vehicleIdCount = 0
//base on colors. for now, we will hav ejust 3 colors. 1 - YELLOW/2 - CYAN/3 - MAGENTA
var colors = [[255,255,0],[255,0,255],[0,255,255]]
//Range to find the food
var rangeFood = 5;


// Create a new vehicle
function Vehicle(x, y, dna) {

  // All the physics stuff
  this.acceleration = createVector();
  this.velocity = p5.Vector.random2D();
  this.position = createVector(x, y);
  this.r = 3;
  this.maxforce = 0.5;
  this.maxspeed = 1.5;
  this.velocity.setMag(this.maxspeed);
  this.firerate = 0;
  this.cooldown = random(1, 15);
  this.id = vehicleIdCount++;
  // Health
  this.health = 1;
  this.willOfFood = this.health-1;


  // Did it receive DNA to copy?
  if (dna instanceof Map) {
    this.dna = new Map();

    if (random(1) < 0.1) {
      this.dna.set(genes.COLOR, colors[floor(random(1,4))-1]);
    }else{
      this.dna.set(genes.COLOR, dna.get(genes.COLOR));
    }

    if (random(1) < 0.1) {
      this.dna.set(genes.FOOD_RADIUS, randomRadiuns());
    }else{
      this.dna.set(genes.FOOD_RADIUS, dna.get(genes.FOOD_RADIUS));
    }
      // 10% chance of mutation
      // if (random(1) < 0.1) {
      //   if (i < 2) {
      //     // Adjust steering force weights
      //     this.dna[i] = dna[i] + random(-0.2, 0.2);
      //
      //   }else if (i == 4){
      //     this.dna[i] = this.dna[i] + random(0,10);
      //
      //   }else if(i == 5){
      //     if(this.dna[i] >30){
      //       this.dna[i] = this.dna[i] + random(-5,0);
      //     }else{
      //       this.dna[i] = this.dna[i] + random(-5,5);
      //     }
      //   }else {
      //     // Adjust perception radius
      //     this.dna[i] = dna[i] + random(-10, 10);
      //   }
      //   // Copy DNA
      // } else {
      //   this.dna[i] = dna[i];
      // }

  } else {
    this.dna = new Map();
    var maxf = 3;
    // DNA
    // 0: Attraction/Repulsion to food
    // 1: Attraction/Repulsion to poison
    // 2: Radius to sense food
    // 3: Radius to sense poison
    // 4: Radius to sense another vehicle
    // 5: Attraction/Repulsion to another vehicle
    // 6: firerate
    // this.dna = [random(-maxf, maxf), random(-maxf, maxf), random(5, 100), random(5, 100), random(30, 200), random(1, 25)];
    //GENE to specify the color of the vehicle
      this.dna.set(genes.COLOR, colors[floor(random(1,4))-1]);
    //GENE to specify how far the vehicle can see the food
      this.dna.set(genes.FOOD_RADIUS, randomRadiuns());
  }
  //  console.log(this.dna.get(genes.FOOD_RADIUS));

}

Vehicle.prototype.display = function() {

  // Color based on health
  var green = color(0, 255, 0);
  var red = color(255, 0, 0);
  var white = color(255,255,255);
  var col = color(this.dna.get(genes.COLOR));
  var colHealth = lerpColor(white, col, this.health);


  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + PI / 2;
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);

  // Extra info
  if (debug.checked()) {
    noFill();

    // Circle and line for food
    stroke(0, 255, 0, 100);
    ellipse(0, 0, this.dna.get(genes.FOOD_RADIUS) * 2);
    line(0, 0, 0, -this.willOfFood * 30);


    stroke(0, 0, 255, 100);
    ellipse(0, 0, this.dna[4] );
  //  line(0, 0, 0, this.health * 25);
  }

  // Draw the vehicle itself
  fill(colHealth);
  stroke(colHealth);
  beginShape();
  vertex(0, -this.r * 2);
  vertex(-this.r, this.r * 2);
  vertex(this.r, this.r * 2);
  //text(this.id, -5, 20);
  endShape(CLOSE);
  pop();
}


// Method to update location
Vehicle.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset acceleration to 0 each cycle
  this.acceleration.mult(0);

  // Slowly die unless you eat
  this.health -= 0.0001;
  this.willOfFood = 1-this.health;

};

// Return true if health is less than zero
Vehicle.prototype.dead = function() {
  return (this.health < 0);
}

// Small chance of returning a new child vehicle
Vehicle.prototype.birth = function() {
  var r = random(1);
  if (r < 0.001 && population.length < 50) {
    // Same location, same DNA
    return new Vehicle(this.position.x, this.position.y, this.dna);
  }
}

// Check against array of food or poison
// index = 0 for food, index = 1 for poison
Vehicle.prototype.eat = function(list, index) {
  var closest = this.seekClosestObj(list);

  if(closest){
    var d = p5.Vector.dist(this.position, closest.position);
    // If it's within perception radius and If we're withing rangeFood pixels, eat it!
    if (d < this.dna.get(genes.FOOD_RADIUS) && d < rangeFood) {
      // Add or subtract from health based on kind of food
      this.health += closest.nutrition;
      this.health = this.health >1 ? 1: this.health;
      closest.nutrition = -1;
    }else if (d < this.dna.get(genes.FOOD_RADIUS)){
      // If something was close
      // Seek
      var seek = this.seek(closest, index);
      console.log(this.willOfFood);
      // Weight according to DNA
      seek.mult(this.willOfFood);
      // Limit
      seek.limit(this.maxforce);
      this.applyForce(seek);
    }
  }

}

// Add force to acceleration
Vehicle.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

// A method that calculates a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Vehicle.prototype.seek = function(target, index) {

  var desired = p5.Vector.sub(target.position, this.position); // A vector pointing from the location to the target
  var d = desired.mag();

  // Scale to maximum speed
  desired.setMag(this.maxspeed);

  // Steering = Desired minus velocity
  var steer = p5.Vector.sub(desired, this.velocity);

  // Not limiting here
  // steer.limit(this.maxforce);

  return steer;
}




// A force to keep it on screen
Vehicle.prototype.boundaries = function() {
  var d = 10;
  var desired = null;
  if (this.position.x < d) {
    desired = createVector(this.maxspeed, this.velocity.y);
  } else if (this.position.x > width - d) {
    desired = createVector(-this.maxspeed, this.velocity.y);
  }

  if (this.position.y < d) {
    desired = createVector(this.velocity.x, this.maxspeed);
  } else if (this.position.y > height - d) {
    desired = createVector(this.velocity.x, -this.maxspeed);
  }

  if (desired !== null) {
    desired.setMag(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
}

Vehicle.prototype.shoot = function(list, bullets){
  if(this.firerate > 0){
      this.firerate --;
      return;
  }

  var closest = this.seekClosestObj(list);

  // If something was close
  if(closest){
    var d = p5.Vector.dist(this.position, closest.position);
    // If it's within perception radius

    if (d < this.dna[4]/2 && this.color != closest.color) {
      var towards = createVector(closest.position.x,closest.position.y);
      var hit = new Bullet(this.position.x,this.position.y, towards);
      bullets.push(hit);
      this.firerate = this.cooldown;
    }
  }

}

Vehicle.prototype.seekClosestObj = function(list){
  // What's the closest?
  var closest = null;
  var closestD = Infinity;
  // Look at everything
  for (var i = list.length - 1; i >= 0; i--) {
    //Check if the list is the population (vehicles) and if it is comparing the vehicle with itself
    if(list[i] instanceof Vehicle && list[i].id == this.id) continue;
    if(list[i] instanceof Vehicle && list[i].color == this.color) continue;
    // Calculate distance
    var d = p5.Vector.dist(list[i].position, this.position);
    // If it's within perception radius and closer than pervious
    if ( d < closestD) {
      closestD = d;
      // Save it
      closest = list[i];
    }
  }
  return closest;
}

Vehicle.prototype.behave = function(){
  // Eat the food (index 0)
  this.eat(food);

  //check if it has a vehicle in sight and shoot
//  this.shoot(population, bullets);

  // Check boundaries
  this.boundaries();

  // Update and draw
  this.update();
}
