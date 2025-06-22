// Toggle Navbar Menu
document.getElementById('navbarToggle').addEventListener('click', function() {
    var navbarMenu = document.getElementById('navbarMenu');
    navbarMenu.classList.toggle('active');
});


// JavaScript for handling the popup
// document.getElementById('goaBtn').addEventListener('click', function() {
//     document.getElementById('locationPopup').style.display = 'flex';
// });


// document.getElementById('closePopup').addEventListener('click', function() {
//     document.getElementById('locationPopup').style.display = 'none';
// });

// Get the button and popup elements
const goaBtn = document.getElementById('goaBtn');
const cityPopup = document.getElementById('cityPopup');
const closeBtn = document.querySelector('.close-btn');

// Show the popup when the button is clicked
goaBtn.addEventListener('click', () => {
  cityPopup.style.display = 'flex';
});

// Hide the popup when the close button is clicked
closeBtn.addEventListener('click', () => {
  cityPopup.style.display = 'none';
});

// Hide the popup when clicking outside the content area
window.addEventListener('click', (event) => {
  if (event.target == cityPopup) {
    cityPopup.style.display = 'none';
  }
});



function closePopup() {
    document.getElementById("bookingPopup").style.display = "none";
}

// Open Popup on clicking the search vehicle button (add this functionality in the relevant place)
function openPopup() {
    document.getElementById("bookingPopup").style.display = "block";
}


// Add event listener to the "Show More" button
document.querySelector('.show-more-btn').addEventListener('click', function() {
    window.location.href = "next_page_url.html"; // Redirect to the next page
});

// Add event listeners to filter items
document.querySelectorAll('.filter-item').forEach(function(item) {
    item.addEventListener('click', function() {
        document.querySelector('.filter-item.active').classList.remove('active');
        this.classList.add('active');
        // Implement filter functionality here
    });
});

// Handle duration selection
document.getElementById('durationSelect').addEventListener('change', function() {
    const selectedDays = this.value;
    // Update the pricing or availability based on selected days
});




document.getElementById('shw-availability').addEventListener('click', function() {
    window.location.href = "Client Panel/availability/index.html"; // Replace with your target page
});




function toggleAnswer(faq) {
    const answer = faq.nextElementSibling;
    const icon = faq.querySelector('.faq-icon');
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    } else {
        answer.style.display = 'block';
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    }
}

function openMoreFaq() {
    window.location.href = "/dashboard/support"; // Add the actual path of the FAQ page
}

function login(){
    window.location.href = "login_page/index.html";
}



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


