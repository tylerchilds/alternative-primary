

var Voter = function(profile, db){
  this.id = profile.id
  this.eligible = this.checkEligibility(profile, db)
}

Voter.prototype.checkEligibility = function(profile, db){
  // innocent until proven guilty

  var ref = db.ref('voters/'+ profile.id)

  ref.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  var eligible = true;
  var u = profile._json;
  console.log(u)
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

Voter.prototype.serialize = function(){
  return {
    id: this.id,
    eligible: this.eligible
  }
}

module.exports = Voter;
