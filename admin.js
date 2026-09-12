// Admin Project Form
function getAuthHeaders() {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        window.location.href = "login.html";
        return {};
    }

    return {
        "Authorization": `Bearer ${token}`
    };
}
const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {
    window.location.href = "login.html";
}
const originalFetch = window.fetch;

window.fetch = function(url, options = {}) {

    const token = localStorage.getItem("adminToken");

    if (!token) {
        window.location.href = "login.html";
        return Promise.reject(new Error("Login required"));
    }

    const headers = new Headers(options.headers || {});

    headers.set("Authorization", `Bearer ${token}`);

    return originalFetch(url, {
    ...options,
    headers: headers
}).then(response => {

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.href = "login.html";
        return Promise.reject(new Error("Session expired"));
    }

    return response;
});
};
const projectForm = document.querySelector("#project-form");

projectForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    // Get form values

    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const technologies = document.querySelector("#technologies").value;
    const github_link = document.querySelector("#github_link").value;
    const live_link = document.querySelector("#live_link").value;
    const image_url = document.querySelector("#image_url").value;


    try {

        // Send data to backend

        const response = await fetch(
            "https://personal-portfolio-backend-9hbs.onrender.com/api/projects",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title,
                    description: description,
                    technologies: technologies,
                    github_link: github_link,
                    live_link: live_link,
                    image_url: image_url

                })
            }
        );


        const data = await response.json();


        if (data.success) {

            alert("Project added successfully! 🎉");

            projectForm.reset();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log("Error:", error);

        alert("Unable to add project.");

    }

});
// Load Projects in Admin Panel

async function loadAdminProjects() {

    const container = document.querySelector("#admin-projects");

    try {

        const response = await fetch(
            "https://personal-portfolio-backend-9hbs.onrender.com/api/projects"
        );

        const data = await response.json();

        if (!data.success) {
            container.innerHTML = "<p>Unable to load projects.</p>";
            return;
        }

        container.innerHTML = "";

        data.projects.forEach((project) => {

            const projectItem = document.createElement("div");

            projectItem.className = "admin-project";

           projectItem.innerHTML = `
    <div>
        <h3>${project.title}</h3>

        <p>${project.description}</p>

        <small>${project.technologies}</small>
    </div>

    <div>
        <button
            class="edit-btn"
            onclick="editProject(${project.id})"
        >
            Edit
        </button>

        <button
            class="delete-btn"
            onclick="deleteProject(${project.id})"
        >
            Delete
        </button>
    </div>
`;

            container.appendChild(projectItem);

        });

    } catch (error) {

        console.log(error);

        container.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}


// Load projects

loadAdminProjects();
// Delete Project

async function deleteProject(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `https://personal-portfolio-backend-9hbs.onrender.com/api/projects/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Project deleted successfully! 🗑️");

            loadAdminProjects();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

        alert("Unable to delete project.");

    }

}
// Edit Project
async function editProject(id) {
    const newTitle = prompt("Enter new project title:");
    if (newTitle === null || newTitle.trim() === "") {
        return;
    }

    const newDescription = prompt("Enter new project description:");
    if (newDescription === null || newDescription.trim() === "") {
        return;
    }

    const newTechnologies = prompt(
        "Enter technologies (example: HTML, CSS, JavaScript):"
    );
    if (newTechnologies === null || newTechnologies.trim() === "") {
        return;
    }

    const newImageUrl = prompt(
        "Enter new project image URL:"
    );

    try {
        const response = await fetch(
            `https://personal-portfolio-backend-9hbs.onrender.com/api/projects/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                    technologies: newTechnologies,
                    image_url: newImageUrl || ""
                })
            }
        );

        const data = await response.json();

        if (data.success) {
            alert("Project updated successfully! ✅");
            loadAdminProjects();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.log("Error:", error);
        alert("Unable to update project.");
    }
}
function logout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "login.html";
}
async function loadMessages() {
    const container = document.querySelector("#admin-messages");

    try {
        const response = await fetch(
            "https://personal-portfolio-backend-9hbs.onrender.com/api/messages"
        );

        const data = await response.json();

        if (!data.success) {
            container.innerHTML =
                "<p>Unable to load messages.</p>";
            return;
        }

        container.innerHTML = "";

        if (data.messages.length === 0) {
            container.innerHTML =
                "<p>No messages yet.</p>";
            return;
        }

        data.messages.forEach((message) => {
            const messageItem = document.createElement("div");

            messageItem.className = "admin-project";

            messageItem.innerHTML = `
                <div>
                    <h3>${message.name}</h3>

                    <p>
                        <strong>Email:</strong>
                        ${message.email}
                    </p>

                    <p>
                        ${message.message}
                    </p>

                    <small>
                        ${message.created_at}
                    </small>
                </div>

                <div>
                    <button
                        class="delete-btn"
                        onclick="deleteMessage(${message.id})"
                    >
                        Delete
                    </button>
                </div>
            `;

            container.appendChild(messageItem);
        });

    } catch (error) {
        console.log(error);

        container.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}

loadMessages();


async function deleteMessage(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `https://personal-portfolio-backend-9hbs.onrender.com/api/messages/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (data.success) {
            alert("Message deleted successfully! 🗑️");
            loadMessages();
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.log(error);
        alert("Unable to delete message.");
    }
}
async function deleteMessage(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `https://personal-portfolio-backend-9hbs.onrender.com/api/messages/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (data.success) {
            alert("Message deleted successfully! 🗑️");
            loadMessages();
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.log(error);
        alert("Unable to delete message.");
    }
}