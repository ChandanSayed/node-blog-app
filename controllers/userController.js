const User = require('../models/User');
exports.login = async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.login();
    console.log(result);
    if (result === 'Congrats!') {
      req.session.user = { favColor: 'black', username: user.data.username };
      req.session.save(() => res.redirect('/'));
    } else {
      console.log('Invalid credentials!');
    }
  } catch (error) {
    req.flash('error', error);
    req.session.save(() => {
      res.redirect('/');
    });
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
exports.logout = function (req, res) {
  req.session.destroy(() => res.redirect('/'));
};
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
  // console.log(req.session.user);
  if (req.session.user) {
    res.render('home-dashboard', { username: req.session.user.username });
  } else {
    res.render('home-guest');
  }
};
