const EventEmitter = require('events')
const firebase = require('../services/firebase')
const FbParser = require('./fb_parser')
const EligiblePerson = require('./person/eligible')
const RealPerson = require('./person/real')

const db = firebase.database()

module.exports = class Voter extends EventEmitter {
  constructor(options){
    super()

    this.success = options.success;
    this.error = options.error;
    const profile = options.profile;

    this.id = profile.id

    db.ref('voters/' + this.id)
      .once('value')
      .then((snapshot) => {
        this.snapshot = snapshot.val();
        // if(this.snapshot){
        //   this.success(this.serialize())
        // } else {
          this.analyze(profile)
        //}

      }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
  }

  analyze(profile){
    const parser = new FbParser({
      profile,
      done: (result) =>{
        this.realityCheck(result)
        this.save(this.saveCallback.bind(this))
      }
    })
  }

  save(cb){
    db.ref('voters/' + this.id).set(this.serialize(), (e) => cb(!e))
  }

  saveCallback(success){
    if(success){
      this.success(this.serialize())
    } else {
      this.error("Unable to save.")
    }
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
