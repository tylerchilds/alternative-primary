import EventEmitter from 'events'
import firebase from '../services/firebase'

const db = firebase.database()

export default class Voter extends EventEmitter {
  constructor(profile){
    super()

    this.id = profile.id

    db.ref('voters/' + this.id)
      .on("value", (snapshot) => {
        this.alreadyVoted = !! (snapshot.val() || {}).voted;
        this.eligible = this.checkEligibility(profile)
        this.emit('ready')
      }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
  }

  checkEligibility(profile){
    // innocent until proven guilty
    var eligible = true;
    var u = profile._json;

    // verified according to FB
    eligible = ! this.alreadyVoted
      ? eligible
      : false;

    // verified according to FB
    eligible = !! u.verified
      ? eligible
      : false;

    // over 18
    eligible = u.age_range.min > 18
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
