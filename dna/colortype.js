
function ColorType(color){
  this.gene = genes.COLOR;
  if(random(1)<0.1){
      this.color = colors[floor(random(1,4))-1];
  }else{
      this.color = color;
  }

}
