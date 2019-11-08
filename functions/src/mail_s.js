var senderMailAddress = 'robotestmailer1001@gmail.com';
var senderMailPass = 'roborobohon898';

var mailer = require('nodemailer');
var mailAddress;





exports.send = function(mailAddress,sub,mailtext){
  var mailset = {
    from: senderMailAddress,
    to: mailAddress,
    subject: sub,
    text: mailtext
  };

  var transporter = mailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,   //TLS
    secure: false,
    requireTLS: true,
    auth:{
       user:senderMailAddress,
       pass:senderMailPass
      }
  });


  transporter.sendMail(mailset,function(error,info){
      if(error){
        console.log(error);
       }else{
        console.log('Mail send' +info.response);
       }
     });
};
