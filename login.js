const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    try {
        const response = await fetch(
            "https://personal-portfolio-backend-9hbs.onrender.com/api/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("adminToken", data.token);
            alert("Login successful! ✅");

            window.location.href = "admin.html";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.log("Error:", error);
        alert("Unable to connect to server.");
    }
});