const axios = require('axios')

module.exports = class QueryBase{
  constructor(callback){
    this.callback = callback;
  }

  fetch(count, next){
    axios.get(next)
      .then((res) => {
        this.fetchCallback(res, count)
      })
      .catch((e) => {
        console.log(e)
        this.done(count)
      })
  }

  fetchCallback(){
    throw new Error('Overwrite fetchCallback!')
  }

  done(count){
    this.callback(this.key, count);
  }
}
