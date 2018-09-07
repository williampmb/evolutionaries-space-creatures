// Create a new bullet
function Bullet(x, y,target) {

  // All the physics stuff
  this.acceleration = createVector();
  this.position = createVector(x, y);
  this.velocity = p5.Vector.sub(target, this.position);

  this.r = 3;
  this.maxforce = 0.5;
  this.maxspeed = 2;
  this.velocity.setMag(this.maxspeed);
  this.health = 100;
  this.target = target;

  var offsetPos = p5.Vector.sub(this.target, this.position);
  offsetPos.limit(1);
  offsetPos.mult(4);
  this.position.add(offsetPos);

}

Bullet.prototype.update = function(){
  //var desired = p5.Vector.sub(this.target, this.position);
  //this.velocity = desired;
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
  //stroke(255, 0, 255, 255);
  //line(0, 0, 0, 10);
  endShape(CLOSE);
  pop();
}

Bullet.prototype.doHit = function(listObj){
  for(var i = 0 ; i < listObj.length ; i++){
      var dist = p5.Vector.dist(this.position, listObj[i].position);
      if(dist <3){
        listObj[i].health -= 0.5;
        return true;
      }
  }
  return false;
}

Bullet.prototype.outOfBounds = function(){
  var d = 30;
  if (this.position.x < d || this.position.x > width - d || this.position.y < d || this.position.y > height - d) {
    return true;
  }
  return false;
}
