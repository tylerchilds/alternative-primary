const Person = require('./person')

module.exports = class RealPerson extends Person{
  analyze(data){
    console.log('real')
    return 1;
  }
}
