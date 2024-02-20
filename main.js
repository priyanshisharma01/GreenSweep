/* ----- NAVIGATION BAR FUNCTION ----- */
const categoryPoints = {
  "Overflowed Dustbins": 10,
  "Illegal Dumping": 20,
  "Need of Dustbins": 15,
  "High Garbage": 25,
};

function myMenuFunction() {
  var menuBtn = document.getElementById("myNavMenu");

  if (menuBtn.className === "nav-menu") {
    menuBtn.className += " responsive";
  } else {
    menuBtn.className = "nav-menu";
  }
}

window.onscroll = function () {
  headerShadow();
};

function headerShadow() {
  const navHeader = document.getElementById("header");

  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    navHeader.style.boxShadow = "0 1px 6px rgba(0, 0, 0, 0.1)";
    navHeader.style.height = "70px";
    navHeader.style.lineHeight = "70px";
  } else {
    navHeader.style.boxShadow = "none";
    navHeader.style.height = "90px";
    navHeader.style.lineHeight = "90px";
  }
}

/* ----- ## -- SCROLL REVEAL ANIMATION -- ## ----- */
const sr = ScrollReveal({
  origin: "top",
  distance: "80px",
  duration: 2000,
  reset: true,
});

/* -- HOME -- */
sr.reveal(".featured-text-card", {});
sr.reveal(".featured-name", { delay: 100 });
sr.reveal(".featured-text-info", { delay: 200 });
sr.reveal(".featured-text-btn", { delay: 200 });
sr.reveal(".social_icons", { delay: 200 });
sr.reveal(".featured-image", { delay: 300 });

/* -- PROJECT BOX -- */
sr.reveal(".project-box", { interval: 200 });

/* -- HEADINGS -- */
sr.reveal(".top-header", {});

/* ----- ## -- SCROLL REVEAL LEFT_RIGHT ANIMATION -- ## ----- */

/* -- ABOUT INFO & CONTACT INFO -- */
const srLeft = ScrollReveal({
  origin: "left",
  distance: "80px",
  duration: 2000,
  reset: true,
});

srLeft.reveal(".about-info", { delay: 100 });
srLeft.reveal(".contact-info", { delay: 100 });

/* -- ABOUT SKILLS & FORM BOX -- */
const srRight = ScrollReveal({
  origin: "right",
  distance: "80px",
  duration: 2000,
  reset: true,
});

srRight.reveal(".skills-box", { delay: 100 });
srRight.reveal(".form-control", { delay: 100 });

/* ----- CHANGE ACTIVE LINK ----- */

const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 50,
      sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}

async function fetchUserData(username) {
  const response = await fetch(`/get-user-data?username=${username}`);
  return response.json();
}

function updateUserInfo(userData) {
  const usernameElement = document.getElementById("username");
  const pointsElement = document.getElementById("points");
  if (usernameElement && pointsElement) {
    usernameElement.textContent = userData.username || "Guest";
    pointsElement.textContent = userData.points || "0";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");

  try {
    const response = await fetch(`/get-user-data?username=${username}`);
    const userData = await response.json();

    document.getElementById("username").innerText = userData.username;
    document.getElementById("points").innerText = userData.points;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

// Update the initializeMap function
function initializeMap() {
  const map = L.map("map").setView([28.5355, 77.3910], 9);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Fetch all entries for all users
  fetch("/get-all-entries")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((entry) => {
        const entryLatitude = parseFloat(entry.latitude);
        const entryLongitude = parseFloat(entry.longitude);

        if (!isNaN(entryLatitude) && !isNaN(entryLongitude)) {
          addMarker(map, entryLatitude, entryLongitude);
        } else {
          console.error(
            "Invalid latitude or longitude in fetched data:",
            entry
          );
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching all entries:", error);
      alert("Error fetching all entries");
    });
}
const entryCounts = {};

async function submitData() {
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const imageInput = document.getElementById("image");
  const imageFile = imageInput.files[0];

  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  const points = categoryPoints[category];

  const formData = new FormData();
  formData.append("name", name);
  formData.append("category", category);
  formData.append("image", imageFile);
  formData.append("username", username);
  formData.append("points", points);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // Append latitude and longitude as strings to FormData
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());

      fetch("/add-data", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data);

          const existingMarker = findMarker(latitude, longitude);

          if (!existingMarker) {
            addMarker(map, latitude, longitude);
          }

          alert("Data added successfully");
        })
        .catch((error) => {
          console.error("Error adding data:", error);
          alert("Error adding data");
        });
    },
    (error) => {
      console.error("Error getting location:", error.message);
      alert("Error getting location. Please try again.");
    }
  );
}

async function addData(formData) {
  try {
    const response = await fetch("/add-data", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log("Server response:", data);
    alert("Data added successfully");
  } catch (error) {
    console.error("Error adding data:", error);
    alert("Error adding data");
  }
}

// Define an array to store markers
const markers = [];

// Add marker to the markers array
function addMarkerToMarkers(marker) {
  markers.push(marker);
}

// Function to find a marker by latitude and longitude
function findMarker(latitude, longitude) {
  for (const marker of markers) {
    const markerLatLng = marker.getLatLng();
    const markerLat = parseFloat(markerLatLng.lat);
    const markerLng = parseFloat(markerLatLng.lng);
    if (
      !isNaN(markerLat) &&
      !isNaN(markerLng) &&
      markerLat === latitude &&
      markerLng === longitude
    ) {
      return marker;
    }
  }
  return null;
}


// function addMarker(map, latitude, longitude) {
//   const areaKey = `${latitude}-${longitude}`;

//   // Increase entry count for the area
//   entryCounts[areaKey] = (entryCounts[areaKey] || 0) + 1;
//   const marker = L.marker([latitude, longitude], {
//     icon: L.icon({
//       iconUrl: "trash.png",
//       iconSize: [32, 32],
//       iconAnchor: [16, 32],
//       popupAnchor: [0, -32],
//     }),
//   }).addTo(map);

//   marker.bindPopup(`<p>Waste Area</p>
//                     <p>Total Entries: ${entryCounts[areaKey]}</p>
//                     <p><img src="/get-latest-image?latitude=${latitude}&longitude=${longitude}" style="max-width: 100px;"></p>`)
//         .openPopup();

//   addMarkerToMarkers(marker);
// }
function addMarker(map, latitude, longitude) {
  const areaKey = `${latitude}-${longitude}`;

  // Increase entry count for the area
  entryCounts[areaKey] = (entryCounts[areaKey] || 0) + 1;
  
  // Create marker
  const marker = L.marker([latitude, longitude], {
    icon: L.icon({
      iconUrl: "trash.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    }),
  }).addTo(map);
  
  // Bind popup content with image
  marker.bindPopup(`<p>Waste Area</p>
                    <p>Total Entries: ${entryCounts[areaKey]}</p>
                    <p><img src="/get-latest-image?latitude=${latitude}&longitude=${longitude}" style="max-width: 100px;"></p>`)
        .openPopup();

  // Add marker to the markers array
  addMarkerToMarkers(marker);
}


window.onload = initializeMap;
window.addEventListener("scroll", scrollActive);
