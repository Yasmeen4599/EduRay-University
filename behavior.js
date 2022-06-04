// Counters

let TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 30) || 1;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  let i = this.loopNum % this.toRotate.length;
  let fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  let that = this;
  let delta = 300 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }
  setTimeout(function () {
    that.tick();
  }, delta);
};
$('[data-toggle="counterUp"]').counterUp({
  delay: 15,
  time: 1000,
});

// Header changing text

window.onload = function () {
  let elements = document.getElementsByClassName("txt-rotate");
  for (let i = 0; i < elements.length; i++) {
    let toRotate = elements[i].getAttribute("data-rotate");
    let period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  let css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};

// Back To Top

mybutton = document.getElementById("myBtn");
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
function topFunction() {
  document.documentElement.scrollTop = 0;
}

// News submenu

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".navbar .nav-link").forEach(function (element) {
    element.addEventListener("click", function (e) {
      $(".fa-angle-down").toggleClass("visible visually-hidden");
      $(".fa-angle-up").toggleClass("visually-hidden visible");

      let nextEl = element.nextElementSibling;
      let parentEl = element.parentElement;

      if (nextEl) {
        e.preventDefault();
        let mycollapse = new bootstrap.Collapse(nextEl);

        if (nextEl.classList.contains("show")) {
          mycollapse.hide();
        } else {
          mycollapse.show();
          // find other submenus with class=show
          var opened_submenu =
            parentEl.parentElement.querySelector(".submenu.show");
          // if it exists, then close all of them
          if (opened_submenu) {
            new bootstrap.Collapse(opened_submenu);
          }
        }
      }
    }); // addEventListener
  }); // forEach
});

// Subscription Confirmation

$(document).ready(function () {
  $("#subscribeBtn").on("click", function () {
    // Remove previous status message
    $(".status").html("");

    // Email and name regex
    var regEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;

    // Get input values
    var name = $("#name").val();
    var email = $("#email").val();

    // Validate input fields
    if (name.trim() == "") {
      alert("Please enter your name.");
      $("#name").focus();
      return false;
    } else if (!regName.test(name)) {
      alert("Please enter a valid name (first & last name).");
      $("#name").focus();
      return false;
    } else if (email.trim() == "") {
      alert("Please enter your email.");
      $("#email").focus();
      return false;
    } else if (email.trim() != "" && !regEmail.test(email)) {
      alert("Please enter a valid email.");
      $("#email").focus();
      return false;
    } else {
      // Post subscription form via Ajax
      $.ajax({
        type: "POST",
        url: "subscription.php",
        dataType: "json",
        data: { subscribe: 1, name: name, email: email },
        beforeSend: function () {
          $("#subscribeBtn").attr("disabled", "disabled");
        },
        success: function (data) {
          if (data.status == "ok") {
            $("#subsFrm")[0].reset();
            $(".status").html('<p class="success">' + data.msg + "</p>");
          } else {
            $(".status").html('<p class="error">' + data.msg + "</p>");
          }
          $("#subscribeBtn").removeAttr("disabled");
        },
      });
    }
  });
});
