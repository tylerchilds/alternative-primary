const EventEmitter = require('events')
const firebase = require('../services/firebase')
const FbParser = require('./fb_parser')
const EligiblePerson = require('./person/eligible')
const RealPerson = require('./person/real')

const db = firebase.database()

module.exports = class Voter extends EventEmitter {
  constructor(profile){
    super()
    this.id = profile.id

    db.ref('voters/' + this.id)
      .once('value')
      .then((snapshot) => {
        this.snapshot = snapshot.val();

        // if(this.snapshot){
        //   this.emit('ready', this.serialize())
        // } else {
          this.analyze(profile)
        // }
      }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
  }

  analyze(p){
    new FbParser(p).on('done', (result) => {
      this.realityCheck(result)
      if(this.save()){
        this.emit('ready', this.serialize())
      } else {
        this.emit('error', "Unable to save.")
      }
    })
  }

  save(){
    return true;
  }

  realityCheck(profile){
    this.eligible = new EligiblePerson(profile).score()
    this.real = new RealPerson(profile).score()
  }

  serialize(){
    const {voted=false, pledged=false} = (this.snapshot || {})
    const {id, eligible, real} = this;

    return { id, eligible, real, voted, pledged }
  }
}
