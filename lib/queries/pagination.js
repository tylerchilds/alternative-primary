const axios = require('axios')

module.exports = class PaginationQuery{
  constructor(items, key, callback){
    let { next } = items.paging;
    this.count = 0;
    this.total = 0;
    this.tally(items.data)

    this.callback = callback;
    this.key = key;

    if(!! next) return this.fetch(next)
    this.done()
  }

  tally(items){
    for(let item of items){
      const { country } = ((item.place || {}).location || {});
      if(country == "United States") this.count++;
      this.total++;
    }
  }

  fetch(next){
    axios.get(next)
      .then(this.fetchCallback.bind(this))
      .catch((e) => {
        console.log(e)
        this.done()
      })
  }

  fetchCallback(res){
    const { data, paging } = res.data;
    this.tally(data);
    let next = (paging || {}).next;

    if(this.count < 100 && !! next){
      this.fetch(next)
    } else {
      this.done()
    }
  }

  done(){
    this.callback(this.key, {
      domestic: this.count,
      global: this.total
    });
  }
}
