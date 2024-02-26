const User = require('../models/User');
exports.login = function (req, res) {
  const user = new User(req.body);
  user.login(function (result) {
    res.send(result);
  });
};
exports.logout = function () {};
exports.register = function (req, res) {
  const user = new User(req.body);
  console.log(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send('Congrats, there are no errors');
  }
};

exports.home = function (req, res) {
  res.render('home-guest');
};
