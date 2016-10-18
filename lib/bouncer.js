module.exports = class Bouncer{
  constructor(req, res, options={}){
    this.req = req;
    this.res = res;

    this.bounce(options)
  }

  bounce(o){
    if(!!o.signedIn) this.enforceSignIn()
    if(!!o.kickVoters) this.kickVoters()
  }

  enforceSignIn(){
    if(! this.req.session.voter)
      this.res.redirect('/start');
  }

  kickVoters(){
    if((this.req.session.voter || {}).voted)
      this.res.redirect('/complete');
  }

  serialize(){
    const voter = (this.req.session || {}).voter || {};

    return {
      signedIn: !! voter.id,
      eligible: Math.round(voter.eligible),
      real: Math.round(voter.real),
      voted: !! voter.voted,
      pledged: !!voter.pledged
    }
  }
}
