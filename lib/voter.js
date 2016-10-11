const EventEmitter = require('events')
const firebase = require('../services/firebase')
const FbQuery = require('./fb_query')

const db = firebase.database()

module.exports = class Voter extends EventEmitter {
  constructor(profile){
    super()
    this.id = profile.id

    db.ref('voters/' + this.id)
      .on("value", (snapshot) => {
        this.alreadyVoted = !! (snapshot.val() || {}).voted;

        const query = new FbQuery(profile._json)
        query.on('done', (result) => {
          this.eligible = this.checkEligibility(result)
          this.emit('ready', this.serialize())
        })
      }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
  }

  checkEligibility(u){
    // innocent until proven guilty
    var eligible = true;
console.log(u)
    // verified according to FB
    eligible = ! this.alreadyVoted
      ? eligible
      : false;

    // verified according to FB
    eligible = !! u.raw.verified
      ? eligible
      : false;

    // over 18
    eligible = u.raw.age_range.min > 18
      ? eligible
      : false;

    eligible = u.tags > 99
      ? eligible
      : false;

    return eligible;
  }

  serialize(){
    return {
      id: this.id,
      eligible: this.eligible,
      voted: this.alreadyVoted
    }
  }
}
