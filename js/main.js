// Main JavaScript for all pages
document.addEventListener("DOMContentLoaded", function () {

  // ===== Dropdown toggle =====
  var dropdownToggles = document.querySelectorAll(".has-dropdown > a");

  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      var parent = this.parentElement;
      document.querySelectorAll(".has-dropdown.open").forEach(function (el) {
        if (el !== parent) el.classList.remove("open");
      });
      parent.classList.toggle("open");
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-dropdown")) {
      document.querySelectorAll(".has-dropdown.open").forEach(function (el) {
        el.classList.remove("open");
      });
    }
  });

  // ===== Hamburger menu toggle =====
  var menuToggle = document.getElementById("menu-toggle");
  var mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && mainNav) {
      mainNav.classList.remove("open");
    }
  });

  // ===== Active nav link highlighting =====
  var currentPage = window.location.pathname.split("/").pop().toLowerCase() || "index.html";
  var navLinks = document.querySelectorAll(".main-nav a");

  navLinks.forEach(function (link) {
    var href = link.getAttribute("href");
    if (href) {
      var linkPage = href.split("/").pop().toLowerCase();
      if (linkPage === currentPage) {
        link.style.color = "#f26522";
        link.style.fontWeight = "700";
      }
    }
  });

  // ===== Search form handling =====
  var searchForm = document.querySelector(".srch form");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var searchInput = document.getElementById("search");
      var query = searchInput ? searchInput.value.trim() : "";
      if (query.length === 0) {
        alert("Please enter a search term.");
        return;
      }
      alert('Search for "' + query + '" is not yet available. Coming soon!');
    });
  }

  // ===== Login form validation =====
  var authForm = document.querySelector('.auth-form form');
  var authTitle = document.querySelector('.auth-title');

  if (authForm && authTitle && authTitle.textContent === "Welcome Back") {
    authForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("email");
      var password = document.getElementById("password");

      if (!email.value.trim()) {
        alert("Please enter your email address.");
        email.focus();
        return;
      }
      if (!password.value.trim()) {
        alert("Please enter your password.");
        password.focus();
        return;
      }

      alert("Login successful! Welcome back.");
      authForm.reset();
      window.location.href = "INDEX.HTML";
    });
  }

  // ===== Register form validation =====
  if (authForm && authTitle && authTitle.textContent === "Create Account") {
    authForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var fullname = document.getElementById("fullname");
      var email = document.getElementById("email");
      var password = document.getElementById("password");
      var confirmPassword = document.getElementById("confirm-password");

      if (!fullname.value.trim()) {
        alert("Please enter your full name.");
        fullname.focus();
        return;
      }
      if (!email.value.trim()) {
        alert("Please enter your email address.");
        email.focus();
        return;
      }
      if (!password.value.trim()) {
        alert("Please create a password.");
        password.focus();
        return;
      }
      if (password.value.length < 6) {
        alert("Password must be at least 6 characters long.");
        password.focus();
        return;
      }
      if (password.value !== confirmPassword.value) {
        alert("Passwords do not match. Please try again.");
        confirmPassword.focus();
        return;
      }

      alert("Registration successful! You can now log in.");
      authForm.reset();
      window.location.href = "login.html";
    });
  }

  // ===== Contact form handling =====
  var contactForm = document.querySelector('.message form');
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var inputs = contactForm.querySelectorAll("input");
      var allFilled = true;

      inputs.forEach(function (input) {
        if (!input.value.trim()) {
          allFilled = false;
        }
      });

      if (!allFilled) {
        alert("Please fill in all fields.");
        return;
      }

      alert("Thank you for your message! We will get back to you soon.");
      contactForm.reset();
    });
  }

  // ===== CART SYSTEM =====

  // Get cart from localStorage
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("buyit_cart")) || [];
    } catch (e) {
      return [];
    }
  }

  // Save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem("buyit_cart", JSON.stringify(cart));
  }

  // Update cart badge count on all pages
  function updateCartBadge() {
    var badge = document.getElementById("cart-badge");
    if (!badge) return;
    var cart = getCart();
    var count = cart.length;
    badge.textContent = count;
    if (count === 0) {
      badge.classList.add("hidden");
    } else {
      badge.classList.remove("hidden");
    }
  }

  // Add item to cart
  function addToCart(name, price, image) {
    var cart = getCart();
    // Check if already in cart
    var exists = cart.some(function (item) {
      return item.name === name;
    });
    if (exists) {
      alert(name + " is already in your cart.");
      return;
    }
    cart.push({ name: name, price: price, image: image });
    saveCart(cart);
    updateCartBadge();
    alert(name + " has been added to your cart!");
  }

  // Remove item from cart
  function removeFromCart(index) {
    var cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartBadge();
    renderCartPage();
  }

  // Make removeFromCart globally accessible for the cart page
  window.removeFromCart = removeFromCart;

  // Initialize cart badge on page load
  updateCartBadge();

  // ===== "Add to Cart" on product cards =====
  var quickViewLinks = document.querySelectorAll(".animal a");
  quickViewLinks.forEach(function (link) {
    // Change link text to "Add to Cart"
    link.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var productCard = this.closest(".animal");
      var productName = productCard ? productCard.querySelector("h1") : null;
      var productPrice = productCard ? productCard.querySelector("p") : null;
      var productImg = productCard ? productCard.querySelector("img") : null;
      var name = productName ? productName.textContent : "Product";
      var price = productPrice ? productPrice.textContent : "";
      var image = productImg ? productImg.getAttribute("src") : "";
      addToCart(name, price, image);
    });
  });

  // ===== Cart page rendering =====
  function renderCartPage() {
    var cartItemsContainer = document.getElementById("cart-items");
    var cartEmptyMsg = document.getElementById("cart-empty");
    var cartSummary = document.getElementById("cart-summary");
    var cartTotalEl = document.getElementById("cart-total");
    var cartCountEl = document.getElementById("cart-count");

    if (!cartItemsContainer) return; // Not on cart page

    var cart = getCart();

    if (cart.length === 0) {
      cartItemsContainer.style.display = "none";
      cartSummary.style.display = "none";
      cartEmptyMsg.style.display = "block";
      return;
    }

    cartEmptyMsg.style.display = "none";
    cartItemsContainer.style.display = "flex";
    cartSummary.style.display = "block";

    // Render items
    var html = "";
    var total = 0;

    cart.forEach(function (item, index) {
      // Parse price: remove # and commas
      var priceNum = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      total += priceNum;

      html += '<div class="cart-item">';
      html += '<img src="' + item.image + '" alt="' + item.name + '">';
      html += '<div class="cart-item-info">';
      html += '<h3>' + item.name + '</h3>';
      html += '<p>' + item.price + '</p>';
      html += '</div>';
      html += '<button class="cart-item-remove" onclick="removeFromCart(' + index + ')" title="Remove">';
      html += '<i class="fa-solid fa-trash"></i>';
      html += '</button>';
      html += '</div>';
    });

    cartItemsContainer.innerHTML = html;
    cartCountEl.textContent = cart.length + " item" + (cart.length > 1 ? "s" : "");
    cartTotalEl.textContent = "#" + total.toLocaleString();
  }

  // Render cart if on cart page
  renderCartPage();

  // Checkout button
  var checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      var cart = getCart();
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      alert("Thank you for your order! Checkout is coming soon.");
    });
  }

});
