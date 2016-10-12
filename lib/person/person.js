module.exports = class Person{
  constructor(data){
    this.s = this.analyze(data)
  }

  score(){
    return this.s;
  }
}
