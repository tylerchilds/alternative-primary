module.exports = class Person{
  constructor(data){
    this.s = this.analyze(data)
  }

  score(){
    return this.s;
  }

  multiply(attr, weight){
    return attr * weight;
  }

  skew(attr, adjust, weight){
    const p = attr / (attr + adjust)
    return p * weight;
  }

  resolve(p, w){
    if(p > 1) p = 1;
    return p * w;
  }
}
