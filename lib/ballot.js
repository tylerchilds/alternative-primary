const candidates = ["Darrell Castle", "Gary Johnson", "Jill Stein", "Alyson Kennedy", "Emidio 'Mimi' Soltysik", "Evan McMullin", "Gloria LaRiva", "Rocky de la Fuente"]
const labels = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"]

module.exports = class Ballot {
  constructor(choices=[], abstained=false){
    this.abstained = abstained;
    this.choices = this.sanitize(choices);
    this.selects = candidates.map(this.generateChoices.bind(this))
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
      } else {
        if(! this.abstained) this.error = "Acknowledge that you are abstaining from certain choices"
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

  hasError(){
    return !! this.error
  }

  serialize(){
    return {
      error: this.error || false,
      form: {
        selects: this.selects,
        abstained: this.abstained
      }
    }
  }
}
