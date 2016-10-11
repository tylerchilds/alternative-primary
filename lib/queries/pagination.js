const axios = require('axios')

module.exports = class PaginationQuery{
  constructor(items, key, callback){
    let { next } = items.paging;
    this.count = 0;
    this.total = 0;
    this.compare(items.data)

    this.callback = callback;
    this.key = key;

    if(!! next) return this.fetch(next)
    this.done(count)
  }

  compare(items){
    for(let i = 0; i < items.length; i++){
      const { country } = ((items[i].place || {}).location || {});
      if(country == "United States") this.count++;
      this.total++;
    }
  }

  fetch(next){
    axios.get(next)
      .then((res) => {
        this.fetchCallback(res)
      })
      .catch((e) => {
        console.log(e)
        this.done()
      })
  }

  fetchCallback(res){
    const { data, paging } = res.data;
    this.compare(data);
    let next = (paging || {}).next;

    if(this.count < 100 && !! next){
      this.fetch(next)
    } else {
      this.done()
    }
  }

  done(){
    this.callback(this.key, this.count);
  }
}
