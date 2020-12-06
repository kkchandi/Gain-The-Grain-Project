var Datastore = require('nedb');
var receivers = new Datastore({ filename: 'receivers.db', autoload: true });
var grocers = new Datastore({ filename: 'grocers.db', autoload: true });

//home
exports.gg_home = function(req, res) {
  var userd = req.signedCookies['userd']
  var signup_login = false;
  
  if(userd) {
    signup_login = true;
  }
    
  var render_dict = {
    message: "Welcome to Gain the Grain!",
    sl: signup_login
  };

  res.render("gg_home", render_dict);
};

//account re-router
exports.gg_account = function(req, res) {
  var userd = req.signedCookies['userd']

  if (userd) {
    if(userd['customer'] == 'receiver')  {
      var endpoint = 'https://gain-the-grain2.glitch.me/account_receiver'
      res.redirect(endpoint)
    }
    else {
      var endpoint = 'https://gain-the-grain2.glitch.me/account_grocer'
      res.redirect(endpoint)
    }
  }
  else {
    var endpoint = 'https://gain-the-grain2.glitch.me/signup_login'
    res.redirect(endpoint)
  }
};

//account if you're a receiver
exports.gg_account_receiver = [find_user_grocery, get_groceries_costs_list, function(req, res) {
  var partner_mssg = ''
  if(res.locals.partner === false) {
    partner_mssg = "YES"
  }
  else {
    partner_mssg = "No"
  }
  
  var render_dict = {
    message: "Account Information",
    hbs_list: res.locals.hbs_list,
    address: res.locals.address,
    partner: partner_mssg
  };
  res.render("gg_account_receiver", render_dict);
}]

//account if you're a grocer
exports.gg_account_grocer = function(req, res) {
  var render_dict = {
    message: "Account Information"
  };
  res.render("gg_account_grocer", render_dict);
};

//options re-router
exports.gg_options = function(req, res) {
  var userd = req.signedCookies['userd']

  if (userd) {
    if(userd['customer'] == 'receiver')  {
      var endpoint = 'https://gain-the-grain2.glitch.me/receivers_options'
      res.redirect(endpoint)
    }
    else {
      var endpoint = 'https://gain-the-grain2.glitch.me/grocers_options'
      res.redirect(endpoint)
    }
  }
  else {
    var endpoint = 'https://gain-the-grain2.glitch.me/signup_login'
    res.redirect(endpoint)
  }
};

function get_receivers(req, res, next) {
  receivers.find({}, { multi: true }, function(err, docs) {
      console.log(docs)
      if(docs === null) {
        next()
      }
      else {
        res.locals.receivers = docs
        next()
      }
    });
}

function get_receivers_groceries_list(req,res,next) {
  if(res.locals.receivers === null) {
    next()
  }
  else {
    res.locals.receivers_list = []
    res.locals.receivers.forEach(function(elem,index) {
        console.log("ELEMEMT @ LINE 302")
        console.log(elem)
        res.locals.receivers_list.push({"username": elem['username'], "groceries": elem['groceries']})
    })
    console.log(res.locals.receivers_list)
    next() 
  }
}

//grocer options
exports.grocers_options = [get_receivers, get_receivers_groceries_list, function(req, res) {
  var render_dict = {
    message: "Grocer options",
    receivers_list: res.locals.receivers_list
  };
  res.render("gg_grocers_options", render_dict);
}]

//receiver options
exports.receivers_options = function(req, res) {
  var render_dict = {
      header: "Receiver's Options",
      message1: "OOPS! This page is only available for grocers.",
      message2: "If you would like to pick up groceries for others, please log out of your receiver account and re-login as a grocer."
    }
  res.render("gg_template", render_dict)
  // var render_dict = {
  //   message: "Receiver options"
  // };
  // res.render("gg_receivers_options", render_dict);
};

//choose between sign up or login
exports.signup_login = function(req, res) {
  var userd = req.signedCookies['userd']
  var signup_login = true
  
  if(userd) {
    signup_login = false //can't log in if you already are
  }
  var render_dict = {
    message: "Sign up or Log In",
    sl: signup_login
  }
  res.render("gg_signup_login", render_dict);
};

//user chooses to log in
exports.choose_login = function(req, res) {
  var render_dict = {
    message: "Log In"
  }
  res.render("gg_login", render_dict);
};

function login_query(req,res, next) {
  var userd = {
    username: req.query.username,
    password: req.query.password,
    customer: req.query.customer, //what type of customer is the user?
    logged_in: true
  }
  res.locals.userd = userd
  res.locals.user_in_database = true;
  
  if(userd['customer'] == 'receiver') {
      console.log("USERNAME @ LINE 96")
      console.log(userd['username'])
      receivers.find({ username: userd['username'], password:userd['password'] }, function(err, docs) {
        console.log(docs)
        if(docs.length == 0) {
          res.locals.user_in_database = false;
          console.log("USER NOT FOUND IN DATABASE")
        }
        next()
      });
  }
  else {
      console.log("USERNAME @ LINE 96")
      console.log(userd['username'])
      grocers.find({ username: userd['username'], password:userd['password'] }, function(err, docs) {
        console.log(docs)
        if(docs.length == 0) {
          res.locals.user_in_database = false;
          console.log("USER NOT FOUND IN DATABASE")
        }
        next()
      });
  }
  
}

//uses ajax to update the hbs page
//user inputs their information to log in
exports.login = [login_query, function(req, res) {
  if(res.locals.user_in_database === true) {
     var render_dict = {
      message: "Thank you for logging in, " + res.locals.userd['username'] + ". Please use the navigation bar to continue."
    }

    res.cookie('userd', res.locals.userd, {signed: true});
    res.render('gg_worker_success', render_dict); 
  }
  else {
    var render_dict = {
      message: "These log in credentials were not found in our database. Please make an account before trying to log in."
    }
    res.render("gg_worker_fail", render_dict)
  }
}]

//user chooses to sign up
exports.choose_signup = function(req, res) {
  var render_dict = {
    header: "Sign up",
  }
  res.render("gg_signup", render_dict);
};

function signup_query(req,res,next) {
  var userd = {
    username: req.query.username,
    password: req.query.password,
    first_name: req.query.first_name,
    last_name: req.query.last_name,
    email: req.query.email,
    address: req.query.address,
    city: req.query.city,
    state: req.query.state,
    zip_code: req.query.zip_code,
    customer: req.query.customer,
    groceries: [],
    item_costs: [],
    partner: false,
    logged_in: true
  }
  
  res.locals.userd = userd;
  
  if(userd['customer'] == 'receiver') {
    receivers.insert(userd, function(err, doc) {
        console.log('Inserted', doc.username, 'with ID', doc._id);
        next()
    }); 
  }
  else {
    grocers.insert(userd, function(err, doc) {
        console.log('Inserted', doc.username, 'with ID', doc._id);
        next()
    });
  }
}


//uses ajax to update the hbs file
//user inputted information is stored on server-side with cookie (database?)
exports.signup = [signup_query, function(req, res) {
  var render_dict = {
    message: "Thank you for signing up, " + res.locals.userd['username'] + ". Please use the navigation bar to continue. We will send an email to ''" + res.locals.userd['email'] + "'' with more details."
  }
  
  res.cookie('userd', res.locals.userd, {signed: true});
  res.render('gg_worker_success', render_dict);
}]

exports.get_groceries = function(req, res) {
  var userd = req.signedCookies["userd"];

  if (userd) {
    if(userd['customer'] == 'receiver') {
     var render_dict = {
        header: "Get Groceries",
        logged_in: true,
        user_name: userd['username'],
        hbs_list: res.locals.hbs_list,
      };
      res.render("gg_getgroceries", render_dict); 
    }
    else {
      var render_dict = {
        header: "Get Groceries",
        message1: "OOPS! This page is only available for receivers.",
        message2: "If you would like to add groceries to your list, please log out of your grocer account and re-login as a receiver."
      }
      res.render("gg_template", render_dict)
    }
  }
  else {
    var endpoint = 'https://gain-the-grain2.glitch.me/signup_login'
    res.redirect(endpoint)
  }
};

function find_user_grocery(req,res,next) {
  var userd = req.signedCookies['userd']
  res.locals.groceries = null;
  res.locals.item_costs = null;
  receivers.findOne({ username: userd['username']}, function(err, docs) {
      if(docs === null) {
        next()
      }
      else {
        console.log("DOCS AT LINE 263")
        console.log(docs)
        res.locals.groceries = docs.groceries
        res.locals.item_costs = docs.item_costs
        res.locals.address = docs.address
        res.locals.partner = docs.partner  
        next()
      }
    });
}


function add_grocery(req,res,next) {
  var userd = req.signedCookies['userd']
  
  var grocery_item = req.query.grocery_item
  var item_cost = req.query.item_cost
  
  res.locals.groceries.push(grocery_item)
  res.locals.item_costs.push(item_cost)
  
  userd['groceries'] = res.locals.groceries
  userd['item_costs'] = res.locals.item_costs
  
  console.log('GROCERIES AT LINE 280')
  console.log(res.locals.groceries)
  
  receivers.update({ username: userd['username'] }, { $set: { groceries: res.locals.groceries, item_costs: res.locals.item_costs} }, function (err, numReplaced) {
    console.log(numReplaced)
    next()
  });
}

function get_groceries_costs_list(req,res,next) {
  res.locals.hbs_list = []
  console.log("GROCERIES @ LINE 316")
  console.log(res.locals.groceries)
  if(res.locals.groceries === null) {
    next()
  }
  else {
    res.locals.groceries.forEach(function(elem,index) {
        console.log("ELEMEMT @ LINE 302")
        console.log(elem)
        res.locals.hbs_list.push({"grocery_item":elem, "item_cost":res.locals.item_costs[index]})
    })
    console.log(res.locals.hbs_list)
    next()
  }
}

exports.add_to_grocery = [find_user_grocery, add_grocery, get_groceries_costs_list, function(req, res){
  var userd = req.signedCookies['userd']
  console.log("Successfully added grocery item to list")
  
  var text_message = 'Successfully added ' + req.query.grocery_item + ' to the grocery list!';
  var render_dict = {
    "message": text_message
  }
  res.render("gg_worker_fail", render_dict)
}]


exports.logout = function(req, res) {
  res.clearCookie('userd')
  res.redirect('https://gain-the-grain2.glitch.me/')
}

function clear_receivers(req,res,next) {
  receivers.remove({}, { multi: true }, function(err, numDeleted) {
    console.log('Deleted', numDeleted);
    next()
  });
}

function clear_grocers(req,res,next) {
  grocers.remove({}, { multi: true }, function(err, numDeleted) {
    console.log('Deleted', numDeleted);
    next()
  });
}

exports.reset = [clear_receivers, clear_grocers, function(req,res) {
  console.log("Cleared databases")
  res.redirect('https://gain-the-grain2.glitch.me/')
}]

exports.about = function(req,res) {
  var render_dict = {
    message: "About"
  }
  res.render("gg_about", render_dict)
}