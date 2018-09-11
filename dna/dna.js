const genes = {
  COLOR: 'color',
  FOOD_ATT: 'food attraction',
  FOOD_RADIUS: 'food vision',
  FIRERATE: 'firerate'
}

function getRadiusMax(){
  return 100;
}

function getRadiusMin(){
  return 10;
}

function randomRadiuns(){
  return floor(random(getRadiusMin(),getRadiusMax()));
}
