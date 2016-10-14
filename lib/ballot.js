const candidates = ["Darrell Castle", "Gary Johnson", "Jill Stein", "Alyson Kennedy", "Emidio 'Mimi' Soltysik", "Evan McMullin", "Gloria LaRiva", "Rocky de la Fuente"]
const labels = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"]

module.exports = class Ballot {
  constructor(choices=['Darrell Castle']){
    this.choices = choices;
    this.selects = candidates.map(this.generateChoices.bind(this))
  }

  generateChoices(candidate, i){
    return {
      label: `${labels[i]} Choice`,
      options: candidates.map((candidate) => this.markSelected(candidate, this.choices[i]))
    }
  }

  markSelected(candidate, choice){
    return {
      value: candidate,
      selected: candidate === choice,
      disabled: this.choices.includes(candidate)
    }
  }

  isComplete(){
    return false
  }

  serialize(){
    return {
      form: {
        selects: this.selects
      }
    }
  }
}
