// Contact Form

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", async (event) => {

    // Page reload रोकना
    event.preventDefault();


    // Form values लेना

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const message = document.querySelector("#message").value;


    try {

        // Backend API को data भेजना

        const response = await fetch("https://personal-portfolio-backend-9hbs.onrender.com/api/messages", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                message: message
            })

        });


        const data = await response.json();


        // Backend response check करना

        if (data.success) {

            alert("Message sent successfully! 🎉");

            // Form खाली करना
            contactForm.reset();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log("Error:", error);

        alert("Unable to send message. Please try again.");

    }

});
// Load Projects from Backend

async function loadProjects() {

    const projectsContainer = document.querySelector("#projects-grid");

    try {

        const response = await fetch(
            "https://personal-portfolio-backend-9hbs.onrender.com/api/projects"
        );

        const data = await response.json();


        if (!data.success) {

            projectsContainer.innerHTML =
                "<p>Unable to load projects.</p>";

            return;
        }


        // Clear existing content

        projectsContainer.innerHTML = "";


        // Create project cards

        data.projects.forEach((project) => {

            const projectCard = document.createElement("div");

            projectCard.className = "project-card";


            projectCard.innerHTML = `

                <div class="project-image">
                    💻
                </div>

                <div class="project-content">

                    <h3>${project.title}</h3>

                    <p>
                        ${project.description}
                    </p>

                    <div class="project-tech">

                        ${project.technologies
                            .split(",")
                            .map(tech => `<span>${tech.trim()}</span>`)
                            .join("")
                        }

                    </div>

                    <div class="project-buttons">

                        <a
                            href="${project.github_link}"
                            target="_blank"
                            class="project-btn"
                        >
                            GitHub
                        </a>

                        <a
                            href="${project.live_link}"
                            target="_blank"
                            class="project-btn live-btn"
                        >
                            Live Demo
                        </a>

                    </div>

                </div>

            `;


            projectsContainer.appendChild(projectCard);

        });

    } catch (error) {

        console.log("Error loading projects:", error);

        projectsContainer.innerHTML =
            "<p>Unable to connect to the server.</p>";

    }
}


// Load projects when website opens

loadProjects();
// Load Projects from Backend

async function loadProjects() {

    const projectsContainer = document.querySelector("#projects-grid");

    try {

        const response = await fetch(
            "https://personal-portfolio-backend-9hbs.onrender.com/api/projects"
        );

        const data = await response.json();

        if (!data.success) {

            projectsContainer.innerHTML =
                "<p>Unable to load projects.</p>";

            return;
        }

        projectsContainer.innerHTML = "";

        data.projects.forEach((project) => {

            const projectCard = document.createElement("div");

            projectCard.className = "project-card";

            projectCard.innerHTML = `

                <div class="project-image">

    ${
        project.image_url
        ? `<img src="${project.image_url}" alt="${project.title}">`
        : "💻"
    }

</div>

                <div class="project-content">

                    <h3>${project.title}</h3>

                    <p>
                        ${project.description}
                    </p>

                    <div class="project-tech">

                        ${project.technologies
                            .split(",")
                            .map(tech => `<span>${tech.trim()}</span>`)
                            .join("")
                        }

                    </div>

                    <div class="project-buttons">

                        <a
                            href="${project.github_link}"
                            target="_blank"
                            class="project-btn"
                        >
                            GitHub
                        </a>

                        <a
                            href="${project.live_link}"
                            target="_blank"
                            class="project-btn live-btn"
                        >
                            Live Demo
                        </a>

                    </div>

                </div>
            `;

            projectsContainer.appendChild(projectCard);

        });

    } catch (error) {

        console.log("Error loading projects:", error);

        projectsContainer.innerHTML =
            "<p>Unable to connect to the server.</p>";
    }
}


// Run function

loadProjects();