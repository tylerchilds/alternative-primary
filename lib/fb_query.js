const EventEmitter = require('events')
const axios = require('axios')

const FIELDS = ['tags']

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

    this.checkTags(profile.tagged_places)
  }

  checkComplete(object, keys){
    for(let key of keys){
      if(! object[key]) return false;
    }

    return true;
  }

  checkTags(tags){
    let next = tags.paging.next;
    let count = this.countTags(tags.data, 0)

    if(!! next) this.moreTags(count, next)

    this.doneTags(count)
  }

  countTags(tags, count){
    for(let i = 0; i < tags.length; i++){
      const { country } = tags[i].place.location;
      if(country == "United States") count++;
      console.log(count)
    }
    return count;
  }

  moreTags(count, next){
    axios.get(next)
      .then((res) => {
        const { data, paging } = res.data;
        count = this.countTags(data, count);
        next = (paging || {}).next;

        if(count < 100 && !! next){
          this.moreTags(count, next)
        } else {
          this.doneTags(count)
        }
      })
      .catch((e) => {
        console.log(e)
        this.doneTags(count)
      })
  }

  doneTags(count){
    this.emit('callback', 'tags', count);
  }
}
