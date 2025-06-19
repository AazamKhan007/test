function handleReview() {
  const isLoggedIn = localStorage.getItem("loggedIn");

  if (isLoggedIn === "true") {
    // Proceed to open review form (future modal or page)
    alert("You can now write a review!");
    // TODO: Open review modal or navigate to review.html
  } else {
    // Redirect or alert to login/signup
    const goLogin = confirm("You need to login or sign up to post a review. Go to login?");
    if (goLogin) {
      window.location.href = "login.html"; // replace with your actual login page
    }
  }
}



// *******************for Review************************

function handleReview() {
  const isLoggedIn = localStorage.getItem("loggedIn");

  if (isLoggedIn === "true") {
    document.getElementById("review-modal").classList.remove("hidden");
  } else {
    const goLogin = confirm("You need to login or sign up to post a review. Go to login?");
    if (goLogin) {
      window.location.href = "login.html";
    }
  }
}

function closeReviewModal() {
  document.getElementById("review-modal").classList.add("hidden");
}

function submitReview() {
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  if (comment.trim() === "") {
    alert("Please enter a comment.");
    return;
  }

  // You could push this into a backend or array
  alert(`Review Submitted:\n⭐ ${rating}\n${comment}`);
  closeReviewModal();
}



// ********************Submit Review*************************

function submitReview() {
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value.trim();

  if (comment === "") {
    alert("Please enter a comment.");
    return;
  }

  const userName = "👤 Guest User"; // later use real login name

  const newReview = document.createElement("div");
  newReview.classList.add("review");
  newReview.innerHTML = `
    <p><strong>${userName} – ⭐ ${rating}</strong></p>
    <p>${comment}</p>
  `;

  document.querySelector(".review-section").appendChild(newReview);

  document.getElementById("rating").value = "5";
  document.getElementById("comment").value = "";
  closeReviewModal();
}

newReview.scrollIntoView({ behavior: "smooth" });

// ***************************Fething the Vendors*******************************

function getVendorIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadVendorDetails() {
  const vendorId = getVendorIdFromURL();
  if (!vendorId) return alert("Vendor ID missing in URL");

  const doc = await firebase.firestore().collection("vendors").doc(vendorId).get();
  if (!doc.exists) return alert("Vendor not found");

  const v = doc.data();

  const goodRatings = (v.hygieneRatings || []).filter(r => r >= 4);
  const hasBadge = goodRatings.length >= 5;

  // Inject data into DOM
  document.querySelector(".vendor-banner img").src = v.image || "assets/img/sample-vendor.jpg";
  document.querySelector(".vendor-info h1").innerHTML = `
    ${v.name} ${hasBadge ? '<img src="assets/img/hygiene-badge.png" class="hygiene-badge"/>' : ''}
  `;

  document.querySelector(".tags").innerHTML = `
    <img src="assets/img/${v.foodType}-icon.png" class="food-icon" />
    ⭐ ${average(v.hygieneRatings).toFixed(1)} • Best under ₹100 • Hygienic Certified
  `;

  document.querySelector(".timing").textContent = `🕒 Open: ${v.openTime} – ${v.closeTime}`;
  document.querySelector(".contact").textContent = `📞 ${v.phone}`;
  document.querySelector(".distance").textContent = `📍 ${v.distance}m away`;

  // Render Menu
  const menuContainer = document.querySelector(".menu-list");
  menuContainer.innerHTML = "";

  (v.menu || []).forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name}</span><span>₹${item.price}</span>`;
    menuContainer.appendChild(li);
  });
}

function average(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

window.addEventListener("DOMContentLoaded", loadVendorDetails);
