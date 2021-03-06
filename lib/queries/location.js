const STATES = require('../../constants/STATES')

module.exports = class LocationQuery{
  constructor(place, key, callback){
    let result = 0;

    this.callback = callback;
    this.key = key;
    
    if(place) result = this.compare(place.name)

    callback(key, result)
  }

  compare(location){
    for(let state of STATES.long){
      const regex = new RegExp(`${state}`, 'g' );
      if(location.match(regex)){
        return 1;
      }
    }

    for(let state of STATES.short){
      const regex = new RegExp(`${state}`, 'g' );
      if(location.match(regex)){
        return .5;
      }
    }

    return 0;
  }
}
