document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map
    const map = L.map('map').setView([20.5937, 78.9629], 5); // Set initial view to India

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Sample data for rental locations
    // const locations = [
    //     { id: 1, name: "Rental Station 1", lat: 28.6139, lng: 77.2090, availableVehicles: 5, rates: "$10/hour", hours: "9 AM - 9 PM" },
    //     { id: 2, name: "Rental Station 2", lat: 19.0760, lng: 72.8777, availableVehicles: 3, rates: "$15/hour", hours: "10 AM - 8 PM" },
    //     { id: 3, name: "Rental Station 3", lat: 13.0827, lng: 80.2707, availableVehicles: 7, rates: "$12/hour", hours: "8 AM - 10 PM" }
    // ];

    const locations = [
        { id: 1, name: "Agra Rental Station", lat: 27.1767, lng: 78.0081, availableVehicles: 5, rates: "₹900/hour", hours: "9 AM - 8 PM" },
        { id: 2, name: "Ahmedabad Rental Station", lat: 23.0225, lng: 72.5714, availableVehicles: 6, rates: "₹1,000/hour", hours: "9 AM - 9 PM" },
        { id: 3, name: "Amritsar Rental Station", lat: 31.6340, lng: 74.8723, availableVehicles: 4, rates: "₹850/hour", hours: "8 AM - 8 PM" },
        { id: 4, name: "Bangalore Rental Station", lat: 12.9716, lng: 77.5946, availableVehicles: 8, rates: "₹1,200/hour", hours: "7 AM - 10 PM" },
        { id: 5, name: "Coorg Rental Station", lat: 12.4208, lng: 75.7397, availableVehicles: 3, rates: "₹1,100/hour", hours: "9 AM - 6 PM" },
        { id: 6, name: "Dehradun Rental Station", lat: 30.3165, lng: 78.0322, availableVehicles: 5, rates: "₹900/hour", hours: "8 AM - 9 PM" },
        { id: 7, name: "Delhi Rental Station", lat: 28.6139, lng: 77.2090, availableVehicles: 10, rates: "₹1,250/hour", hours: "7 AM - 11 PM" },
        { id: 8, name: "Dharamshala Rental Station", lat: 32.2190, lng: 76.3234, availableVehicles: 3, rates: "₹850/hour", hours: "8 AM - 8 PM" },
        { id: 9, name: "Goa Rental Station", lat: 15.2993, lng: 74.1240, availableVehicles: 7, rates: "₹1,050/hour", hours: "9 AM - 8 PM" },
        { id: 10, name: "Hyderabad Rental Station", lat: 17.3850, lng: 78.4867, availableVehicles: 6, rates: "₹950/hour", hours: "9 AM - 10 PM" },
        { id: 11, name: "Jaipur Rental Station", lat: 26.9124, lng: 75.7873, availableVehicles: 5, rates: "₹950/hour", hours: "8 AM - 8 PM" },
        { id: 12, name: "Jodhpur Rental Station", lat: 26.2389, lng: 73.0243, availableVehicles: 4, rates: "₹900/hour", hours: "9 AM - 7 PM" },
        { id: 13, name: "Kolkata Rental Station", lat: 22.5726, lng: 88.3639, availableVehicles: 7, rates: "₹1,150/hour", hours: "8 AM - 9 PM" },
        { id: 14, name: "Leh Rental Station", lat: 34.1526, lng: 77.5770, availableVehicles: 3, rates: "₹1,250/hour", hours: "7 AM - 7 PM" },
        { id: 15, name: "Manali Rental Station", lat: 32.2396, lng: 77.1887, availableVehicles: 5, rates: "₹1,050/hour", hours: "8 AM - 8 PM" },
        { id: 16, name: "Mathura Rental Station", lat: 27.4924, lng: 77.6737, availableVehicles: 4, rates: "₹850/hour", hours: "9 AM - 7 PM" },
        { id: 17, name: "Mumbai Rental Station", lat: 19.0760, lng: 72.8777, availableVehicles: 9, rates: "₹1,250/hour", hours: "7 AM - 11 PM" },
        { id: 18, name: "Nainital Rental Station", lat: 29.3803, lng: 79.4636, availableVehicles: 3, rates: "₹950/hour", hours: "9 AM - 7 PM" },
        { id: 19, name: "Rishikesh Rental Station", lat: 30.0869, lng: 78.2676, availableVehicles: 6, rates: "₹900/hour", hours: "8 AM - 8 PM" },
        { id: 20, name: "Shimla Rental Station", lat: 31.1048, lng: 77.1734, availableVehicles: 4, rates: "₹1,050/hour", hours: "8 AM - 7 PM" },
        { id: 21, name: "Udaipur Rental Station", lat: 24.5854, lng: 73.7125, availableVehicles: 5, rates: "₹950/hour", hours: "9 AM - 9 PM" },
        { id: 22, name: "Vadodara Rental Station", lat: 22.3072, lng: 73.1812, availableVehicles: 6, rates: "₹950/hour", hours: "8 AM - 8 PM" },
        { id: 23, name: "Varanasi Rental Station", lat: 25.3176, lng: 82.9739, availableVehicles: 8, rates: "₹850/hour", hours: "7 AM - 9 PM" },
        { id: 24, name: "Vizag Rental Station", lat: 17.6868, lng: 83.2185, availableVehicles: 4, rates: "₹900/hour", hours: "8 AM - 8 PM" }
      ];
      

    const markers = [];
    // Adding markers to the map
    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`
            <div class="marker-popup">
                <h4>${location.name}</h4>
                <p>Available Vehicles: ${location.availableVehicles}</p>
                <p>Rates: ${location.rates}</p>
                <p>Rental Hours: ${location.hours}</p>
            </div>
        `);
        markers.push(marker);
    });

    // Display location list
    const locationList = document.getElementById('locationList');
    locationList.innerHTML = '<h3>Rental Stations</h3>';
    locations.forEach(location => {
        const item = document.createElement('div');
        item.className = 'location-item';
        item.innerHTML = location.name;
        item.onclick = () => {
            map.setView([location.lat, location.lng], 13);
            markers[location.id - 1].openPopup(); // Open corresponding marker popup
        };
        locationList.appendChild(item);
    });

    // Add animation on marker hover
    markers.forEach(marker => {
        marker.on('mouseover', function () {
            this.openPopup();
        });
        marker.on('mouseout', function () {
            this.closePopup();
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const items = locationList.getElementsByClassName('location-item');
        Array.from(items).forEach(item => {
            const isMatch = item.innerText.toLowerCase().includes(searchTerm);
            item.style.display = isMatch ? 'block' : 'none';
        });
    });
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
