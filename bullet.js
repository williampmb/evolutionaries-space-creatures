// Create a new bullet
function Bullet(x, y,target) {

  // All the physics stuff
  this.acceleration = createVector();
  this.position = createVector(x, y);
  this.velocity = p5.Vector.sub(target, this.position);

  this.maxspeed = 2;
  this.velocity.setMag(this.maxspeed);
  this.damage = 0.1;
  this.target = target;

  var offsetPos = p5.Vector.sub(this.target, this.position);
  offsetPos.limit(1);
  offsetPos.mult(4);
  this.position.add(offsetPos);

}

Bullet.prototype.update = function(){
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
}

Bullet.prototype.display = function() {

  push();
  translate(this.position.x, this.position.y);

  beginShape();
  fill(255, 255, 0);
  noStroke();
  ellipse(0, 0, 4);
  endShape(CLOSE);
  pop();
}

Bullet.prototype.doHit = function(listObj){
  for(var i = 0 ; i < listObj.length ; i++){
      var dist = p5.Vector.dist(this.position, listObj[i].position);
      if(dist <3){
        listObj[i].health -= this.damage;
        return true;
      }
  }
  return false;
}

Bullet.prototype.outOfBounds = function(){
  var d = 10;
  if (this.position.x < d || this.position.x > width - d || this.position.y < d || this.position.y > height - d) {
    return true;
  }
  return false;
}
