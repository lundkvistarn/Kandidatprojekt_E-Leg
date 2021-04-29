var qr;
(function () {
      qr = new QRious({
          element: document.getElementById('qr-code'),
          size: 200,
          value: 'Rubbber duck'
      });
  })(); 
  var qr;
  function generateQRCode() {
      var qrtext = document.getElementById("qr-text").value;
      document.getElementById("qr-result").innerHTML = "QR code for " + qrtext + ":";
      alert(qrtext);
      qr.set({
          foreground: 'black',
          size: 200,
          value: 'http://localhost:1337/' + Profile
      });
  }

  
  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  console.log(uuidv4());