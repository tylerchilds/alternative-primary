(function(){
  window.onload = function() {
    document.addEventListener('change', handleSelection)
    stickFooter()
  };

  const handleSelection = function(){
    const selects = document.querySelectorAll('select')
    const values = getValues(selects);

    selects.forEach(s => {
      const options = s.querySelectorAll('option')

      options.forEach((o) => markSelected(s, o, values))
    })
  }

  const markSelected = function(s, o, values){
    let notSelected = s.value !== o.value
    notSelected = notSelected && values.indexOf(o.value) > -1
    notSelected = notSelected || o.value === "sep"

    if(notSelected)
      o.setAttribute('disabled', true);
    else
      o.removeAttribute('disabled');
  }

  const getValues = function($){
    let values = [];

    $.forEach(s => {
      if(s.value !== "abstain")
        values.push(s.value)
    })

    return values;
  }

  const stickFooter = function(){
    const html = document.querySelector('body')
    const footer = document.querySelector('footer')

    footer.className += ' sticky'
    html.style.paddingBottom = footer.offsetHeight;
  }
})()
