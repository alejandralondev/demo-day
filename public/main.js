// everything that's static is in public 

var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const dateBought = this.parentNode.parentNode.childNodes[3].innerText
        const expirationDate = this.parentNode.parentNode.childNodes[5].innerText
        const msg = this.parentNode.parentNode.childNodes[7].innerText
        const price = this.parentNode.parentNode.childNodes[9].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'dateBought': dateBought,
            'expirationDate': expirationDate,
            'msg': msg,
            'price': price,
            'thumbUp': thumbUp,
            'subtract': false
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const dateBought = this.parentNode.parentNode.childNodes[3].innerText
    const expirationDate = this.parentNode.parentNode.childNodes[5].innerText
    const msg = this.parentNode.parentNode.childNodes[7].innerText
    const price = this.parentNode.parentNode.childNodes[9].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messages', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'dateBought': dateBought,
        'expirationDate': expirationDate,
        'msg': msg,
        'price': price,
        'thumbUp': thumbUp,
        'subtract': true
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const dateBought = this.parentNode.parentNode.childNodes[3].innerText
        const expirationDate = this.parentNode.parentNode.childNodes[5].innerText
        const msg = this.parentNode.parentNode.childNodes[7].innerText
        const price = this.parentNode.parentNode.childNodes[9].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'dateBought': dateBought,
            'expirationDate': expirationDate,
            'msg': msg,
            'price': price
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
