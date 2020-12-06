function choose_login() {
  var endpoint = "https://gain-the-grain2.glitch.me/choose_login";
  window.location.href = endpoint;
}
function choose_signup() {
  var endpoint = "https://gain-the-grain2.glitch.me/choose_signup";
  window.location.href = endpoint;
}

function login_receiver() {
  var continu = login_formval();
  console.log(continu);
  if (continu === true) {
    var username = document.querySelector("input[name='l_username']").value;
    var password = document.querySelector("input[name='l_password']").value;
    var ajax_params = {
      url: "https://gain-the-grain2.glitch.me/login",
      type: "get",
      data: { username: username, password: password, customer: "receiver" },
      success: onLoginResponse
    };
    $.ajax(ajax_params);
  }
}

function login_grocer() {
  var continu = login_formval();
  console.log(continu);
  if (continu === true) {
    var username = document.querySelector("input[name='l_username']").value;
    var password = document.querySelector("input[name='l_password']").value;
    var ajax_params = {
      url: "https://gain-the-grain2.glitch.me/login",
      type: "get",
      data: { username: username, password: password, customer: "grocer" },
      success: onLoginResponse
    };
    $.ajax(ajax_params);
  }
}

function login_formval() {
  var username = document.getElementById("l_username");
  var ue_message = document.getElementById("l_username_error_message");
  var password = document.getElementById("l_password");
  var pe_message = document.getElementById("l_password_error_message");

  return text_val(username, ue_message) && text_val(password, pe_message);
}

function onLoginResponse(responseText) {
  var switchable = document.getElementById("switchable");
  switchable.innerHTML = responseText;
}

function signup_receiver() {
  var continu = signup_formval_receiver();
  console.log(continu);
  if (continu === true) {
    var username = document.querySelector("input[name='s_username']").value;
    var password = document.querySelector("input[name='s_password']").value;
    var first_name = document.querySelector("input[name='s_first_name']").value;
    var last_name = document.querySelector("input[name='s_last_name']").value;
    var email = document.querySelector("input[name='s_email']").value;
    var address = document.querySelector("input[name='s_address']").value;
    var city = document.querySelector("input[name='s_city']").value;
    var state = document.querySelector("input[name='s_state']").value;
    var zip_code = document.querySelector("input[name='s_zip_code']").value;

    var ajax_params = {
      url: "https://gain-the-grain2.glitch.me/signup",
      type: "get",
      data: {
        username: username,
        password: password,
        first_name: first_name,
        last_name: last_name,
        email: email,
        address: address,
        city: city,
        state: state,
        zip_code: zip_code,
        customer: "receiver"
      },
      success: onSignupResponse
    };
    $.ajax(ajax_params);
  }
}

function signup_grocer() {
  var continu = signup_formval_receiver();
  console.log(continu);
  if (continu === true) {
    var username = document.querySelector("input[name='s_username']").value;
    var password = document.querySelector("input[name='s_password']").value;
    var first_name = document.querySelector("input[name='s_first_name']").value;
    var last_name = document.querySelector("input[name='s_last_name']").value;
    var email = document.querySelector("input[name='s_email']").value;
    var address = document.querySelector("input[name='s_address']").value;
    var city = document.querySelector("input[name='s_city']").value;
    var state = document.querySelector("input[name='s_state']").value;
    var zip_code = document.querySelector("input[name='s_zip_code']").value;

    var ajax_params = {
      url: "https://gain-the-grain2.glitch.me/signup",
      type: "get",
      data: {
        username: username,
        password: password,
        first_name: first_name,
        last_name: last_name,
        email: email,
        address: address,
        city: city,
        state: state,
        zip_code: zip_code,
        customer: "grocer"
      },
      success: onSignupResponse
    };
    $.ajax(ajax_params);
  }
}

function signup_formval_receiver() {
  var username = document.getElementById("s_username");
  var password = document.getElementById("s_password");
  var first_name = document.getElementById("s_first_name");
  var last_name = document.getElementById("s_last_name");
  var email = document.getElementById("s_email");
  var address = document.getElementById("s_address");
  var city = document.getElementById("s_city");
  var state = document.getElementById("s_state");
  var zip_code = document.getElementById("s_zip_code");

  var error_message = document.getElementById("s_error_message");

  return (
    text_val(username, error_message) &&
    text_val(password, error_message) &&
    text_val(first_name, error_message) &&
    text_val(last_name, error_message) &&
    text_val(email, error_message) &&
    text_val(address, error_message) &&
    text_val(city, error_message) &&
    text_val(state, error_message) &&
    text_val(zip_code, error_message)
  );
}

function onSignupResponse(responseText) {
  var switchable = document.getElementById("switchable");
  switchable.innerHTML = responseText;
}

function text_val(text, error_message) {
  if (text.value.length <= 0) {
    error_message.innerHTML =
      "<br/>" +
      "Please make sure the field(s) contain(s) at least 1 character!" +
      "<br/>";
    error_message.style.color = "#F00";
    return false;
  } else {
    return true;
  }
}

function logout() {
  var endpoint = "https://gain-the-grain2.glitch.me/logout";
  window.location.href = endpoint;
}

function add_item_grocery() {
  var continu = add_item_formval();
  console.log(continu);
  if (continu === true) {
    // var listNode = document.getElementById('groceryList');
    // var liNode = document.createElement("LI");
    // var txtNode = document.createTextNode(item);
    // liNode.appendChild(txtNode);
    // listNode.appendChild(liNode);

    // var get_grocery_list = document.getElementById("get_grocery_list");
    // var account_grocery_list = document.getElementById("account_grocery_list");    //doesn't work bc it's in another doc, returns null

    var grocery_item_val = document.querySelector("input[name='grocery_item']").value;
    var item_cost_val = document.querySelector("input[name='item_cost']").value;

    var ajax_params = {
      url: "https://gain-the-grain2.glitch.me/add_to_grocery",
      type: "get",
      data: {
        grocery_item: grocery_item_val,
        item_cost: item_cost_val
      },
      success: onAddResponse
    };
    $.ajax(ajax_params);
  }
}

function onAddResponse(responseText) {
  var message = document.getElementById("switchable");
  message.innerHTML = responseText;
  console.log("Successfully added grocery item")
}

function del_item_grocery() {
  // var del_grocery_item = document.querySelector("input[name='del_grocery_item']");
  var item = document.getElementById("del_grocery_item");
  item.parentNode.removeChild(item);

  //   var del_grocery_item = document.querySelector("input[name='del_grocery_item']").value;
  //   var add_err = document.getElementById("add_error_message");

  //   var get_grocery_list = document.getElementById("get_grocery_list");

  //   console.log(get_grocery_list);

  //   var li = document.createElement("li");
  //   li.className = "groceryitem";
  //   var text_node = document.createTextNode(del_grocery_item);

  //   console.log(text_node);
  //   console.log(li);

  // //   li.removeChild(text_node);
  //   get_grocery_list.removeChild(li);
}

function add_item_formval() {
  var item = document.querySelector("input[name='grocery_item']");
  var cost = document.querySelector("input[name='item_cost']");
  var add_err = document.getElementById("add_error_message");

  return text_val(item, add_err) && text_val(cost, add_err);
}

function login_password() {
  console.log("showing password");
  var x = document.getElementById("l_password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function signin_password() {
  console.log("showing password");
  var x = document.getElementById("s_password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
