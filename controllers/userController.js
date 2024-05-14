const User = require("../models/User");
exports.login = async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.login();
    console.log(result);
    if (result === "Congrats!") {
      req.session.user = { avatar: user.avatar, username: user.data.username };
      req.session.save(() => res.redirect("/"));
    } else {
      console.log("Invalid credentials!");
    }
  } catch (error) {
    req.flash("error", error);
    req.session.save(() => {
      res.redirect("/");
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
  req.session.destroy(() => res.redirect("/"));
};
exports.register = function (req, res) {
  const user = new User(req.body);

  user
    .register()
    .then(() => {
      req.session.user = { username: user.data.username, avatar: user.avatar };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch(regErrors => {
      regErrors.forEach(function (error) {
        req.flash("regErrors", error);
      });
      console.log(regErrors);
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.home = function (req, res) {
  // console.log(req.session.user);
  if (req.session.user) {
    res.render("home-dashboard", {
      username: req.session.user.username,
      avatar: req.session.user.avatar
    });
  } else {
    res.render("home-guest", { error: req.flash("error"), regErrors: req.flash("regErrors") });
  }
};
