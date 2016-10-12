const axios = require('axios')

module.exports = class AlbumsQuery{
  constructor(items, key, callback){
    let { next } = items.paging;
    this.total = 0;
    this.oldest = new Date()
    this.query(items.data)

    this.callback = callback;
    this.key = key;

    if(!! next) return this.fetch(next)
    this.done()
  }

  query(items){
    for(let item of items){
      const timestamp = new Date(item.created_time)

      if(timestamp < this.oldest)
        this.oldest = timestamp

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
    this.query(data);
    let next = (paging || {}).next;

    if(!! next){
      this.fetch(next)
    } else {
      this.done()
    }
  }

  done(){
    this.callback(this.key, {
      total: this.total,
      oldest: this.oldest
    });
  }
}
