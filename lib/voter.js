const EventEmitter = require('events')
const firebase = require('../services/firebase')
const FbParser = require('./fb_parser')
const EligiblePerson = require('./person/eligible')
const RealPerson = require('./person/real')

const db = firebase.database()

module.exports = class Voter extends EventEmitter {
  constructor(profile){
    super()

    this.profile = profile;
    this.id = profile.id
  }

  initialize(){
    db.ref('voters/' + this.id)
      .once('value')
      .then((snapshot) => {
        this.snapshot = snapshot.val();
        // if(this.snapshot){
        //   this.emit('ready', this.serialize())
        // } else {
          this.analyze(this.profile)
        // }
      }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
      });
  }

  analyze(profile){
    const parser = new FbParser(profile)

    parser.on('done', (result) => {
      this.realityCheck(result)
      this.save(this.saveCallback.bind(this))
    })

    parser.initialize()
  }

  save(cb){
    db.ref('voters/' + this.id).set(this.serialize(), (e) => cb(!e))
  }

  saveCallback(success){
    if(success){
      this.emit('ready', this.serialize())
    } else {
      this.emit('error', "Unable to save.")
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
