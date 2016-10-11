const EventEmitter = require('events')
const PaginationQuery = require('./queries/pagination')

const FIELDS = ['tags', 'events']

module.exports = class FbQuery extends EventEmitter{
  constructor(profile){
    super()

    this.result = {raw: profile};

    this.on('callback', (key, value) => {
      this.result[key] = value;

      if(this.checkComplete(this.result, FIELDS)){
        this.emit('done', this.result)
      }
    })

    const cb = this.callback.bind(this)

    new PaginationQuery(profile.tagged_places, 'tags', cb)
    new PaginationQuery(profile.events, 'events', cb)
  }

  callback(key, value){
    this.emit('callback', key, value)
  }

  checkComplete(object, keys){
    for(let key of keys){
      if(! object[key]) return false;
    }

    return true;
  }
}
