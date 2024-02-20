











document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".input-field");
  const toggle_btn = document.querySelectorAll(".toggle");
  const main = document.querySelector("main");
  const bullets = document.querySelectorAll(".bullets span");
  const images = document.querySelectorAll(".image");

  inputs.forEach((inp) => {
    inp.addEventListener("focus", () => {
      inp.classList.add("active");
    });
    inp.addEventListener("blur", () => {
      if (inp.value != "") return;
      inp.classList.remove("active");
    });
  });

  toggle_btn.forEach((btn) => {
    btn.addEventListener("click", () => {
      main.classList.toggle("sign-up-mode");
    });
  });



  
    function moveSlider() {
      let index = this.dataset.value;
  
      let currentImage = document.querySelector(`.img-${index}`);
      images.forEach((img) => img.classList.remove("show"));
      currentImage.classList.add("show");
  
      const textSlider = document.querySelector(".text-group");
      textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
  
      bullets.forEach((bull) => bull.classList.remove("active"));
      this.classList.add("active");
    }
  
    // Function to move to the next slide
    function moveToNextSlide() {
      const activeBullet = document.querySelector(".bullets .active");
      let nextIndex = Number(activeBullet.dataset.value) + 1;
      if (nextIndex > bullets.length) {
        nextIndex = 1;
      }
      bullets[nextIndex - 1].click(); // Trigger click event on the next bullet
    }
  
    // Automatically move to the next slide every 3 seconds
    setInterval(moveToNextSlide, 2000);
  
    bullets.forEach((bullet) => {
      bullet.addEventListener("click", moveSlider);
    });
 

  bullets.forEach((bullet) => {
    bullet.addEventListener("click", moveSlider);
  });
  document
    .getElementById("signin-btn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      login();
    });

  document
    .getElementById("signup-btn")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default form submission behavior
      register(); // Call the register function
    });

  function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid credentials");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Server response:", data);

        // Set the username and points in variables
        const loggedInUsername = data.username;
        const loggedInPoints = data.points || 0; // Default to 0 if points are undefined

        // Redirect to home.html after successful login with username and points
        window.location.href = `home.html?username=${loggedInUsername}&points=${loggedInPoints}`;
      })
      .catch((error) => {
        console.error("Error during login:", error);
        document.getElementById("login-error").innerText =
          "Invalid credentials. Please check your username and password.";
        document.getElementById("login-error").style.display = "block";
      });
  }

  function redirectToRegister() {
    console.log("Redirecting to register.html");
    window.location.href = "register.html";
  }

  function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const email = document.getElementById("register-email").value;
    const phone = document.getElementById("register-phone").value;

    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        phone: phone,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Redirect to the specified URL
          window.location.href = "index.html";
        } else {
          // Handle registration failure if needed
          console.error("Registration failed");
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
      });
  }
});
