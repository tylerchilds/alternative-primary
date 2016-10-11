const EventEmitter = require('events')
const PaginationQuery = require('./queries/pagination')
const LocationQuery = require('./queries/location')
const JobQuery = require('./queries/job')

const FIELDS = ['tags', 'events']

module.exports = class FbQuery extends EventEmitter{
  constructor(profile){
    super()

    this.result = {raw: profile};

    this.on('callback', (key, value) => {
      this.result[key] = value;

      this.checkComplete()
    })

    const cb = this.callback.bind(this)

    new PaginationQuery(profile.tagged_places, 'tags', cb)
    new PaginationQuery(profile.events, 'events', cb)
    new LocationQuery(profile.location, 'location', cb)
    new LocationQuery(profile.hometown, 'hometown', cb)
    new JobQuery(profile.work, 'work', cb)
  }

  callback(key, value){
    this.emit('callback', key, value)
  }

  checkComplete(){
    for(let key of FIELDS){
      if(! this.result[key]) return false;
    }

    this.emit('done', this.result)
  }
}
