var gg = require("./gg");

exports.doSet = function(app) {
  //-------express 'get' handlers
  app.get("/", gg.gg_home);
  app.get("/get_groceries", gg.get_groceries);
  app.get("/add_to_grocery", gg.add_to_grocery);

  app.get("/account", gg.gg_account);
  app.get("/account_receiver", gg.gg_account_receiver);
  app.get("/account_grocer", gg.gg_account_grocer);

  app.get("/options", gg.gg_options);
  app.get("/grocers_options", gg.grocers_options);
  app.get("/receivers_options", gg.receivers_options);

  app.get("/signup_login", gg.signup_login);

  app.get("/choose_login", gg.choose_login);
  app.get("/login", gg.login);
  app.get("/choose_signup", gg.choose_signup);
  app.get("/signup", gg.signup);

  app.get("/logout", gg.logout);

  app.get("/reset", gg.reset);
  
  app.get("/about", gg.about);
};
