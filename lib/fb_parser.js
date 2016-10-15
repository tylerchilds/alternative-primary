const EventEmitter = require('events')
const PaginationQuery = require('./queries/pagination')
const LocationQuery = require('./queries/location')
const JobQuery = require('./queries/job')
const AlbumsQuery = require('./queries/albums')

const FIELDS = [
  'tags',
  'events',
  'location',
  'hometown',
  'work',
  'verified',
  'age',
  'friends',
  'albums'
]

module.exports = class FbParser extends EventEmitter{
  constructor(profile){
    super()

    this.profile = profile;
    this.result = {raw: profile};
    this.cb = this.callback.bind(this)

    this.on('callback', (key, value) => {
      this.result[key] = value;
      this.checkComplete()
    })
  }

  initialize(){
    const {profile, cb} = this;

    this.age(profile)
    this.verified(profile)
    this.friends(profile)

    new PaginationQuery(profile.tagged_places, 'tags', cb)
    new PaginationQuery(profile.events, 'events', cb)
    new LocationQuery(profile.location, 'location', cb)
    new LocationQuery(profile.hometown, 'hometown', cb)
    new JobQuery(profile.work, 'work', cb)
    new AlbumsQuery(profile.albums, 'albums', cb)
  }

  callback(key, value){
    this.emit('callback', key, value)
  }

  checkComplete(){
    for(let key of FIELDS){
      if(typeof this.result[key] === "undefined"){
        return false;
      }
    }

    this.emit('done', this.result)
  }

  age(p){
    try{
      this.result['age'] = p.age_range.min > 18
        ? 1 : 0;
    } catch(e){
      this.result['age'] = 0;
    }
  }

  verified(p){
    this.result['verified'] = !! p.verified
      ? 1 : 0;
  }

  friends(p){
    try{
      this.result['friends'] = p.friends.summary.total_count;
    } catch(e){
      this.result['friends'] = 0
    }
  }
}
