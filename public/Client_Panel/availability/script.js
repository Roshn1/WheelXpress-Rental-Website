// Selecting filter dropdowns and the grid container
const vehicleTypeDropdown = document.getElementById("vehicleType");
const transmissionTypeDropdown = document.getElementById("transmissionType");
const fuelTypeDropdown = document.getElementById("fuelType");
const cityTypeDropdown = document.getElementById("cityType");
const sortByDropdown = document.getElementById("sortBy");
const vehicleCards = document.querySelectorAll(".vehicle-card");

// Function to filter vehicle cards based on dropdown selections
function filterVehicles() {
    const vehicleType = vehicleTypeDropdown.value;
    const transmissionType = transmissionTypeDropdown.value;
    const fuelType = fuelTypeDropdown.value;
    const cityType = cityTypeDropdown.value.trim().toLowerCase();

    vehicleCards.forEach(card => {
        // Get relevant attributes of each vehicle card
        const vehicleDetails = card.querySelector(".vehicle-details").textContent.toLowerCase();
        const vehicleLocation = card.querySelector(".vehicle-location").textContent.toLowerCase();

        // Check if the card matches all selected filters
        const matchesType = vehicleType === "all" || vehicleDetails.includes(vehicleType);
        const matchesTransmission = transmissionType === "any" || vehicleDetails.includes(transmissionType);
        const matchesFuel = fuelType === "any" || vehicleDetails.includes(fuelType);
        const matchesCity = cityType === "any" || vehicleLocation.includes(cityType);

        // Show or hide the card based on matching filters
        if (matchesType && matchesTransmission && matchesFuel && matchesCity) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Function to sort vehicle cards by selected criteria
function sortVehicles() {
    const sortBy = sortByDropdown.value;
    const container = document.querySelector(".availability-grid");

    // Convert NodeList to array for sorting
    const sortedCards = Array.from(vehicleCards).sort((a, b) => {
        const priceA = parseInt(a.querySelector(".price").textContent.replace(/[^0-9]/g, ""));
        const priceB = parseInt(b.querySelector(".price").textContent.replace(/[^0-9]/g, ""));

        if (sortBy === "priceLowHigh") {
            return priceA - priceB;
        } else if (sortBy === "priceHighLow") {
            return priceB - priceA;
        }
        return 0; // Keep order the same for 'popularity'
    });

    // Clear container and re-append sorted cards
    container.innerHTML = "";
    sortedCards.forEach(card => container.appendChild(card));
}

// Event listeners for filtering and sorting
vehicleTypeDropdown.addEventListener("change", filterVehicles);
transmissionTypeDropdown.addEventListener("change", filterVehicles);
fuelTypeDropdown.addEventListener("change", filterVehicles);
cityTypeDropdown.addEventListener("change", filterVehicles);
sortByDropdown.addEventListener("change", sortVehicles);



// Get selected city from dropdown
const citySelect = document.getElementById("cityDropdown");

citySelect.addEventListener("change", function() {
    const selectedCity = citySelect.value;

    // Filter bikes by selected city
    fetch(`/api/bikes?city=${selectedCity}`)
        .then(response => response.json())
        .then(bikes => {
            displayBikes(bikes); // Update the UI to show only bikes from the selected city
        })
        .catch(error => console.error("Error fetching bikes:", error));
});



// Show scroll-to-top button when scrolling down
window.onscroll = function () {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// Scroll to top function when the button is clicked
document.getElementById('scrollToTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});