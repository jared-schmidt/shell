// Meteor.call('sendEmail',
//             'jaschmidtty+shell@problemsolutions.net',
//             'shell@shell.com',
//             'Hello from Meteor!',
//             'This is a test of Email.send.');

Meteor.methods({
    sendEmail: function (to, from, subject, text) {
      check([to, from, subject, text], [String]);

      // Let other method calls from the same client start running,
      // without waiting for the email sending to complete.
      this.unblock();

      Email.send({
        to: to,
        from: from,
        subject: subject,
        text: text
      });
    }
});
