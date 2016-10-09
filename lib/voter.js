import EventEmitter from 'events'

export default class Voter extends EventEmitter {
  constructor(profile, db){
    super()

    this.id = profile.id

    var ref = db.ref('voters/' + this.id)

    ref.on("value", (snapshot) => {
      this.loaded = true;
      this.alreadyVoted = !! snapshot.val();
    }, (errorObject) => {
      console.log("The read failed: " + errorObject.code);
    });

    this.fetchStatus = setInterval(() => {
      if(! this.loaded) return;
      this.eligible = this.checkEligibility(profile)
      this.emit('ready')
      clearInterval(this.fetchStatus)
    }, 50);

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
      eligible: this.eligible
    }
  }
}
