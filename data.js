// data.js

const defaultProperties = [
    { 
        id: "PG-1001", 
        title: "Zolo Premium Coliving", 
        city: "Bengaluru",
        location: "Koramangala", 
        type: "Single Room", 
        price: 12000, 
        rating: 4.8,
        reviewCount: 15,
        totalScore: 72,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", 
        available: true 
    },
    { 
        id: "PG-1002", 
        title: "Stanza Living Suites", 
        city: "Bengaluru",
        location: "HSR Layout", 
        type: "1 BHK", 
        price: 16500, 
        rating: 4.5,
        reviewCount: 8,
        totalScore: 36,
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80", 
        available: true 
    },
    { 
        id: "PG-1003", 
        title: "Urban Nest Apartments", 
        city: "Pune",
        location: "Viman Nagar", 
        type: "3 BHK", 
        price: 22000, 
        rating: 4.9,
        reviewCount: 20,
        totalScore: 98,
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80", 
        available: true 
    }
];

// Initialize Local Storage DB securely
function initDB() {
    if (!localStorage.getItem("pg_properties")) {
        localStorage.setItem("pg_properties", JSON.stringify(defaultProperties));
    }
}

// Database Helpers
function getRooms() { return JSON.parse(localStorage.getItem("pg_properties")) || []; }
function saveRooms(rooms) { localStorage.setItem("pg_properties", JSON.stringify(rooms)); }

initDB(); // Run instantly when file loads