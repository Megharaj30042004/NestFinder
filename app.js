// app.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. If we are on the Home Page, render all properties immediately
    const grid = document.getElementById("propertyGrid");
    if (grid) {
        renderProperties(); // Loads all by default
        
        // Setup Search Listeners
        document.getElementById("searchBtn").addEventListener("click", filterProperties);
        document.getElementById("searchInput").addEventListener("keyup", (e) => {
            if(e.key === "Enter") filterProperties();
        });
    }

    // 2. If we are on the Add Room Page, setup the form listener
    const addForm = document.getElementById("addRoomForm");
    if (addForm) {
        addForm.addEventListener("submit", handleAddRoom);
    }
});

// --- RENDER & DISPLAY LOGIC ---
function renderProperties(filteredData = null) {
    const grid = document.getElementById("propertyGrid");
    const countDisplay = document.getElementById("resultCount");
    const properties = filteredData || getRooms();
    
    grid.innerHTML = "";
    if(countDisplay) countDisplay.innerText = `Showing ${properties.length} properties`;

    if (properties.length === 0) {
        grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;'>No properties found matching your search.</p>";
        return;
    }

    properties.forEach(prop => {
        const btnClass = prop.available ? "btn-book" : "btn-book btn-disabled";
        const btnText = prop.available ? "Proceed to Book" : "Currently Sold Out";
        
        // Format rating to 1 decimal place
        const displayRating = prop.rating > 0 ? prop.rating.toFixed(1) : "New";
        const availabilityBadge = prop.available ? "" : `<div class="badge badge-sold">Sold Out</div>`;

        grid.innerHTML += `
            <div class="card">
                <div class="badge-container">
                    <div class="badge"><i class="fa-solid fa-star" style="color:#fbbf24;"></i> ${displayRating}</div>
                    ${availabilityBadge}
                </div>
                <img src="${prop.image}" alt="${prop.title}" class="card-img">
                
                <div class="card-body">
                    <h3 style="font-size: 18px; font-weight: 700; color: #0f172a;">${prop.title}</h3>
                    <p style="color: #64748b; font-size: 14px; margin: 8px 0;"><i class="fa-solid fa-location-dot"></i> ${prop.location}, ${prop.city}</p>
                    <p style="font-weight: 600; font-size: 14px;">Type: ${prop.type}</p>
                    
                    <button class="review-btn" onclick="addReview('${prop.id}')">
                        <i class="fa-regular fa-star"></i> Rate this property (${prop.reviewCount} reviews)
                    </button>
                    
                    <div style="margin-top: auto; padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 22px; font-weight: 700; color: #2563eb;">₹${prop.price}<span style="font-size:12px; color:#64748b;">/mo</span></div>
                        <a href="javascript:void(0)" onclick="initiateBooking('${prop.id}')" class="${btnClass}">${btnText}</a>
                    </div>
                </div>
            </div>
        `;
    });
}

// --- SEARCH LOGIC ---
function filterProperties() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const typeFilter = document.getElementById("typeFilter").value;
    const allProps = getRooms();

    const filtered = allProps.filter(prop => {
        const matchesSearch = prop.city.toLowerCase().includes(searchText) || prop.location.toLowerCase().includes(searchText) || prop.title.toLowerCase().includes(searchText);
        const matchesType = typeFilter === "All" || prop.type === typeFilter;
        return matchesSearch && matchesType;
    });

    renderProperties(filtered);
}

// --- REVIEW LOGIC ---
function addReview(propertyId) {
    const scoreStr = prompt("Rate this property from 1 to 5 stars (e.g., 4 or 4.5):");
    if (!scoreStr) return; // User cancelled
    
    const score = parseFloat(scoreStr);
    if (isNaN(score) || score < 1 || score > 5) {
        alert("Please enter a valid number between 1 and 5.");
        return;
    }

    const properties = getRooms();
    const index = properties.findIndex(p => p.id === propertyId);
    
    if (index !== -1) {
        // Calculate new average
        properties[index].reviewCount += 1;
        properties[index].totalScore += score;
        properties[index].rating = properties[index].totalScore / properties[index].reviewCount;
        
        saveRooms(properties);
        alert("Thank you for your review!");
        
        // Re-render to show updated score immediately
        if (document.getElementById("searchInput").value !== "") {
            filterProperties(); 
        } else {
            renderProperties();
        }
    }
}

// --- ADMIN ADD ROOM LOGIC ---
function handleAddRoom(e) {
    e.preventDefault();
    
    // Generate Unique ID
    const randomNum = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    const newId = `PG-${randomNum}`;

    const newRoom = {
        id: newId,
        title: document.getElementById("rTitle").value,
        city: document.getElementById("rCity").value,
        location: document.getElementById("rLoc").value,
        type: document.getElementById("rType").value,
        price: parseInt(document.getElementById("rPrice").value),
        image: document.getElementById("rImage").value,
        rating: 0,
        reviewCount: 0,
        totalScore: 0,
        available: true
    };

    const properties = getRooms();
    properties.unshift(newRoom); // Add to the TOP of the array
    saveRooms(properties);
    
    alert(`Success! "${newRoom.title}" has been added to the listings.`);
    window.location.href = "index.html"; // Send them back to see it
}

// --- BOOKING LOGIC ---
function initiateBooking(id) {
    localStorage.setItem("selected_pg", id);
    window.location.href = "booking.html";
}