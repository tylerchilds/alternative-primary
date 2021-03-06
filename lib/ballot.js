const EventEmitter = require('events')
const firebase = require('../services/firebase')

const candidates = ["Darrell Castle", "Gary Johnson", "Jill Stein", "Alyson Kennedy", "Emidio 'Mimi' Soltysik", "Evan McMullin", "Gloria LaRiva", "Rocky de la Fuente"]
const labels = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"]

const db = firebase.database()

module.exports = class Ballot extends EventEmitter {
  constructor(voter, {choices=[], confirmation=false}){
    super()

    this.voter = voter;
    this.confirmation = confirmation;
    this.choices = choices;
  }

  initialize(){
    this.choices = this.sanitize(this.choices);
    this.selects = candidates.map(this.generateChoices.bind(this))
    this.checkConfirmation()

    if(this.hasError()){
      this.emitError()
    } else {
      this.emit('ready')
    }
  }

  save(cb){
    // double check the voter hasn't voted already
    db.ref('voters/' + this.voter.id + '/voted')
      .once('value')
      .then((snapshot) => {
        this.voted = !! snapshot.val();

        if(this.voted){
          this.emitError("You can only vote once!")
        } else {
          this.saveBallot(cb)
        }
      }, (errorObject) => {
        this.emitError("Unable to read from the database, please try again!")
        console.log("The read failed: " + errorObject.code);
      });
  }

  saveBallot(cb){
    const ballotKey = db.ref().child('posts').push().key

    let updates = {};

    updates['voters/' + this.voter.id + '/voted'] = true
    updates['ballots/' + ballotKey] = this.serialize().vote

    db.ref().update(updates, (e) => {
      if(!! e){
        this.emitError('Unable to save your ballot.')
      } else {
        cb()
      }
    })
  }

  sanitize(choices){
    const noAbstains = this.removeAbstains(choices);
    const valid = this.valid(noAbstains);
    return this.unique(valid);
  }

  removeAbstains(choices){
    return choices.reduce((a, current) => {
      if(current !== 'abstain'){
        a.push(current)
      }
      return a;
    }, [])
  }

  unique(choices){
    return choices.reduce((a, current) => {
      if(! a.includes(current)){
        a.push(current)
      } else {
        this.error = "No duplicates selections allowed"
      }
      return a;
    }, [])
  }

  valid(choices){
    return choices.reduce((a, current) => {
      if(candidates.includes(current)){
        a.push(current)
      } else {
        this.error = "Only valid candidates allowed"
      }
      return a;
    }, [])
  }

  generateChoices(candidate, i){
    return {
      label: `${labels[i]} Choice`,
      options: candidates.map((candidate) => this.markSelected(candidate, this.choices[i]))
    }
  }

  markSelected(candidate, choice){
    const selected = candidate === choice
    const disabled = this.choices.includes(candidate) && !selected
    return {
      value: candidate,
      selected, disabled
    }
  }

  checkConfirmation(){
    if(! this.confirmation)
      this.error = "You must confirm your votes are accurate";
  }

  hasError(){
    return !! this.error;
  }

  emitError(error){
    this.error = error || this.error;
    this.emit('error', this.error)
  }

  serialize(){
    return {
      error: this.error,
      form: {
        selects: this.selects,
        confirmation: this.confirmation
      },
      vote: {
        choices: this.choices,
        real: Math.round(this.voter.real),
        eligible: Math.round(this.voter.eligible)
      }
    }
  }
}
