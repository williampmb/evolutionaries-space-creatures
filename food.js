var foodIdGlobal = 0;

function Food(x, y) {

  // All the physics stuff
  this.position = createVector(random(width), random(height));
  this.nutrition = random(1,5);
  this.id = foodIdGlobal++;

}

Food.prototype.display = function() {
  noStroke();
  fill(0, 255, 0);
  ellipse(this.position.x, this.position.y, 4);
}

Food.prototype.dead = function(){
  if(this.nutrition == -1){
    return true;
  }
  return false;
}
