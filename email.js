// email.js

// Initialize EmailJS
(function() {
  
    emailjs.init({ publicKey: "-vTY39kXeLvCMIzPj" }); 
})();

document.addEventListener("DOMContentLoaded", () => {
    // Only run this logic if we are actually on the checkout page
    const checkoutForm = document.getElementById("checkoutForm");
    if (!checkoutForm) return;

    const selectedId = localStorage.getItem("selected_pg");
    const properties = getRooms();
    const property = properties.find(p => p.id === selectedId);

    if(!property) {
        window.location.href = "index.html"; return;
    }

    // Populate UI
    document.getElementById("bTitle").innerText = property.title + " (" + property.type + ")";
    document.getElementById("bLoc").innerText = property.location + ", " + property.city;
    document.getElementById("bPrice").innerText = "₹" + property.price;

    // Handle Submit
    checkoutForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const btn = document.querySelector("#checkoutForm button");
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Booking...';
        btn.disabled = true;

        const name = document.getElementById("uName").value;
        const email = document.getElementById("uEmail").value;
        const phone = document.getElementById("uPhone").value;

        
        emailjs.send("service_fp2xobh", "template_t3jheng", {
            to_name: name,
            to_email: email,
            phone_number: phone,
            room_name: property.title,
            room_location: property.location,
            total_price: property.price
        }).then(() => {
            property.available = false;
            saveRooms(properties); // Save to database
            
            alert("Booking Success! Confirmation sent to " + email);
            window.location.href = "index.html";
        }).catch((err) => {
            console.error("EmailJS Error:", err);
            alert("Booking recorded, but the email receipt failed to send. Check console.");
            window.location.href = "index.html";
        });
    });
});