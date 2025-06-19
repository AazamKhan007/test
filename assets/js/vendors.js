window.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("location-popup");
  const enableBtn = document.getElementById("enable-location-btn");
  const vendorList = document.getElementById("vendor-list");

  // Show popup and blur the vendor list
  popup.classList.remove("hidden");
  vendorList.classList.add("blurred");

  // Enable location button click
  enableBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          popup.classList.add("hidden");
          vendorList.classList.remove("blurred");

          // Optional: Use coordinates
          console.log("Latitude:", pos.coords.latitude);
          console.log("Longitude:", pos.coords.longitude);
        },
        (err) => {
          alert("Error getting location: " + err.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });
});

// ********************fetchvendors from backend******************

async function fetchVendors() {
  const container = document.querySelector(".vendor-list");
  container.innerHTML = ""; // Clear existing

  const snapshot = await firebase.firestore().collection("vendors").get();
  let vendors = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    const hygieneRatings = data.hygieneRatings || [];
    const goodRatings = hygieneRatings.filter(r => r >= 4);
    const hasBadge = goodRatings.length >= 5;

    vendors.push({ id: doc.id, ...data, hasBadge });
  });

  // Sort: badge vendors first
  vendors.sort((a, b) => b.hasBadge - a.hasBadge);

  vendors.forEach(v => {
    const card = document.createElement("div");
    card.classList.add("vendor-card");

    card.innerHTML = `
      <img src="${v.image || "assets/img/sample-vendor.jpg"}" alt="${v.name}" />
      <div class="vendor-info">
        <h3>
          ${v.name}
          ${v.hasBadge ? '<img src="assets/img/hygiene-badge.png" class="hygiene-badge" />' : ''}
        </h3>
        <p>
          <img src="assets/img/${v.foodType}-icon.png" class="food-icon" />
          ⭐ ${average(v.hygieneRatings).toFixed(1)} • Best under ₹100
        </p>
        <p>${v.openTime} – ${v.closeTime}</p>
        <p>📍 ${v.distance}m away</p>
      </div>
    `;

    // Wrap in <a> to link to vendor-detail.html
    const link = document.createElement("a");
    link.href = `vendor-detail.html?id=${v.id}`;
    link.classList.add("vendor-card-link");
    link.appendChild(card);

    container.appendChild(link);
  });
}

function average(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

window.addEventListener("DOMContentLoaded", fetchVendors);
