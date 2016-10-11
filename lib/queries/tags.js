const axios = require('axios')
const QueryBase = require('./base')

module.exports = class QueryTags extends QueryBase{
  constructor(tags, callback){
    super(callback)
    this.key = 'tags';

    let { next } = tags.paging;
    let count = this.count(tags.data, 0)

    if(!! next) this.fetch(count, next)

    this.done(count)
  }

  count(tags, count){
    for(let i = 0; i < tags.length; i++){
      const { country } = tags[i].place.location;
      if(country == "United States") count++;
    }
    return count;
  }

  fetchCallback(res, count){
    const { data, paging } = res.data;
    count = this.count(data, count);
    let next = (paging || {}).next;

    if(count < 100 && !! next){
      this.fetch(count, next)
    } else {
      this.done(count)
    }
  }
}
