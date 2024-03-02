const User = require('../models/User');
exports.login = async (req, res) => {
  try {
    const user = new User(req.body);
    req.session.user = { favColor: 'black', username: user.data.username };
    const result = await user.login();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
  // const user = new User(req.body);
  // user
  //   .login()
  //   .then(result => {
  //     res.send(result);
  //   })
  //   .catch(e => {
  //     res.send(e);
  //   });
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
  console.log(req.session.user);
  if (req.session.user) {
    res.send('Session is running');
  } else {
    res.render('home-guest');
  }
};
