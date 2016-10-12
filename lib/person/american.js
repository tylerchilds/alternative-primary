const Person = require('./person')

module.exports = class American extends Person{
  analyze(data){
    console.log('american')
    return 1;
  }
}
