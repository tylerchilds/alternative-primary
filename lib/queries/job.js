const LocationQuery = require('./location')

module.exports = class JobQuery{
  constructor(jobs, key, callback){
    this.callback = callback;
    this.key = key;
    this.count = 0;
    this.total = 0;

    if(jobs){
      const result = this.compare(jobs)
    }

    this.done()
  }

  compare(jobs){
    for(let job of jobs){
      if(job.location){
        new LocationQuery(job.location, null, (_, result) => {
          this.count += result;
        })
      }
      this.total++;
    }
  }

  done(){
    this.callback(this.key, {
      domestic: this.count / 2,
      global: this.total
    })
  }
}
