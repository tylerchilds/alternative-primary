const Person = require('./person')

module.exports = class EligiblePerson extends Person{
  analyze(data){

    const {age, events, hometown, location, tags, work} = data;

    const confidence =
      this.multiply(age, 10) +
      this.events(events, 25) +
      this.multiply(hometown, 15) +
      this.multiply(location, 15) +
      this.tags(tags, 25) +
      this.work(work, 10);

    return confidence;
  }

  events(attr, weight){
    const ratio = this.ratio(attr);
    const skew = this.skew(attr.domestic, 5, 8)

    const p = ((ratio * 2) + skew) / 10;
    return p * weight;
  }

  tags(attr, weight){
    const ratio = this.ratio(attr);
    const skew = this.skew(attr.domestic, 10, 4)

    const p = ((ratio * 6) + skew) / 10;
    return p * weight;
  }

  work(attr, weight){
    const ratio = this.ratio(attr);
    const skew = this.skew(attr.domestic, .8, 7)

    const p = ((ratio * 3) + skew) / 10;
    return p * weight;
  }

  ratio({domestic, global}){
    const ratio = domestic / global;
    return isNaN(ratio) ? 0 : ratio;
  }
}
