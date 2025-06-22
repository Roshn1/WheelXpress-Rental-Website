const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const submenus = document.querySelectorAll(".submenu");

hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

submenus.forEach((menu) => {
    menu.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const ctxRentals = document.getElementById("rentalsChart").getContext("2d");
    const rentalsChart = new Chart(ctxRentals, {
        type: "bar",
        data: {
            labels: ["July", "August", "September", "October", "November"],
            datasets: [
                {
                    label: "Number of Rentals",
                    data: [50, 60, 55, 70, 90],
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    const ctxRevenue = document.getElementById("revenueChart").getContext("2d");
    const revenueChart = new Chart(ctxRevenue, {
        type: "line",
        data: {
            labels: ["July", "August", "September", "October", "November"],
            datasets: [
                {
                    label: "Revenue in $",
                    data: [5000, 6000, 5500, 7000, 9000],
                    backgroundColor: "rgba(255, 206, 86, 0.2)",
                    borderColor: "rgba(255, 206, 86, 1)",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
});

document.querySelectorAll(".percentage-circle").forEach((circle, index) => {
    const percentageValues = [80, 90, 70]; 
    circle.innerText = percentageValues[index] + "%";
});


document.getElementById('addBikeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const vehicleData = {
        vehicleType: document.getElementById('vehicleType').value,
        name: document.getElementById('bikeName').value,
        imagePath: document.getElementById('bikeImage').value || 'default.jpg',
        price: parseInt(document.getElementById('bikePrice').value),
        seater: parseInt(document.getElementById('seater').value),
        transmission: document.getElementById('transmission').value,
        fuel: document.getElementById('fuel').value,
        stock: parseInt(document.getElementById('stock').value)
    };

    try {
        const response = await fetch('/add-vehicle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vehicleData)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            const tableBody = document.getElementById('vehiclesTableBody');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.vehicle.vehicleType}</td>
                <td>${result.vehicle.name}</td>
                <td><img src="${result.vehicle.imagePath}" alt="${result.vehicle.name}" width="100"></td>
                <td>${result.vehicle.price}</td>
                <td>${result.vehicle.seater}</td>
                <td>${result.vehicle.transmission}</td>
                <td>${result.vehicle.fuel}</td>
                <td>${result.vehicle.stock}</td>
            `;
            tableBody.appendChild(row);
        } else {
            alert('Error adding vehicle: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add vehicle');
    }
});


function generateReport() {
    const reportType = document.getElementById("reportType").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        alert("Please select a date range.");
        return;
    }

    const reportOutput = document.getElementById("reportOutput");
    reportOutput.style.display = "block";

    reportOutput.innerHTML = `<h3>${reportType} Report</h3>
                              <p>For dates: ${startDate} to ${endDate}</p>`;

    if (reportType === "rentals") {
        reportOutput.innerHTML += `
            <table>
                <thead>
                    <tr>
                        <th>Vehicle Name</th>
                        <th>Rental Date</th>
                        <th>Rented By</th>
                        <th>Duration (days)</th>
                        <th>Total Cost</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Honda CB Shine</td>
                        <td>${startDate}</td>
                        <td>John Doe</td>
                        <td>3</td>
                        <td>$150</td>
                    </tr>
                    <tr>
                        <td>TVS Jupiter</td>
                        <td>${endDate}</td>
                        <td>Jane Smith</td>
                        <td>2</td>
                        <td>$100</td>
                    </tr>
                </tbody>
            </table>
        `;
    } else if (reportType === "revenue") {
        reportOutput.innerHTML += `
            <p><strong>Total Revenue:</strong> $2,500</p>
            <p><strong>Average Revenue per Rental:</strong> $125</p>
            <p><strong>Top Revenue Vehicle:</strong> Toyota Corolla ($1,500)</p>
        `;
    } else if (reportType === "vehicleUsage") {
        reportOutput.innerHTML += `
            <table>
                <thead>
                    <tr>
                        <th>Vehicle Name</th>
                        <th>Times Rented</th>
                        <th>Total Rental Duration (days)</th>
                        <th>Fuel Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Honda CB Shine</td>
                        <td>5</td>
                        <td>15</td>
                        <td>Petrol</td>
                    </tr>
                    <tr>
                        <td>TVS Jupiter</td>
                        <td>3</td>
                        <td>6</td>
                        <td>Petrol</td>
                    </tr>
                    <tr>
                        <td>Toyota Corolla</td>
                        <td>2</td>
                        <td>8</td>
                        <td>Petrol</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
}



window.onscroll = function () {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};


document.getElementById('scrollToTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

