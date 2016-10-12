const Person = require('./person')

module.exports = class RealPerson extends Person{
  analyze(data){

    const {albums, events, friends, tags, verified, work} = data;

    const confidence =
      this.account(albums.oldest, 20) +
      this.skew(albums.total, 8, 10) +
      this.skew(events.global, 13, 10) +
      this.skew(friends, 160, 20) +
      this.skew(tags.global, 5, 15) +
      this.multiply(verified, 20) +
      this.skew(work.global, 1.5, 5);

    return confidence;
  }

  account(attr, weight){
    const fbEst = 12;
    const loyalty = new Date().getFullYear() - new Date(attr).getFullYear()
    const p = (loyalty + loyalty / 2.25) / fbEst;

    return this.resolve(p, weight)
  }
}
