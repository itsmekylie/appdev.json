document.addEventListener("DOMContentLoaded", function () {

    // Animate progress bars
    document.querySelectorAll(".progress-bar").forEach((bar) => {
        let width = bar.getAttribute("style").match(/\d+/)[0]; // Extract width percentage
        bar.style.width = "0"; // Reset to 0 before animation
        setTimeout(() => {
            bar.style.transition = "width 2s ease-in-out";
            bar.style.width = width + "%"; // Animate to actual width
        }, 300);
    });

    // Correct GitHub Raw JSON Link
    const courseJsonURL = "https://raw.githubusercontent.com/itsmekylie/courses.json/main/courses.json";

    function fetchCourseList() {
        fetch(courseJsonURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data.courses)) {
                    displayCourseList(data.courses);
                } else {
                    console.error("Invalid course data format", data);
                }
            })
            .catch(error => console.error("Error fetching course data:", error));
    }

    function displayCourseList(courses) {
        const courseList = document.getElementById("course-list");
        if (!courseList) return;
        courseList.innerHTML = ""; // Clear previous content
    
        let courseContainer = document.createElement("div");
        courseContainer.classList.add("course-container");
    
        let title = document.createElement("h2");
        title.innerText = "Courses Taken";
        title.classList.add("course-title");
    
        courseContainer.appendChild(title);
    
        // Search Bar with Clear Button
        let searchContainer = document.createElement("div");
        searchContainer.classList.add("search-container");
    
        let searchInput = document.createElement("input");
        searchInput.setAttribute("type", "text");
        searchInput.setAttribute("id", "search-bar");
        searchInput.setAttribute("placeholder", "Search by Course Code or Name...");
        searchInput.addEventListener("input", () => filterCourses(courses));
    
        let clearButton = document.createElement("button");
        clearButton.innerText = "Clear";
        clearButton.classList.add("clear-button");
        clearButton.addEventListener("click", () => {
            searchInput.value = "";
            filterCourses(courses);
        });
    
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(clearButton);
        courseContainer.appendChild(searchContainer);
    
        // Group courses by year level
        let groupedCourses = {};
        courses.forEach(course => {
            if (!groupedCourses[course.year_level]) {
                groupedCourses[course.year_level] = [];
            }
            groupedCourses[course.year_level].push(course);
        });
    
        // Loop through grouped courses and create sections
        for (let year in groupedCourses) {
            let yearSection = document.createElement("div");
            yearSection.classList.add("year-section");
            yearSection.setAttribute("data-year", year);
    
            let yearTitle = document.createElement("h3");
            yearTitle.innerText = `${year} Year`;
            yearTitle.classList.add("year-title");
    
            yearSection.appendChild(yearTitle);
    
            groupedCourses[year].forEach(course => {
                let courseBox = document.createElement("div");
                courseBox.classList.add("course-box");
                courseBox.setAttribute("data-course-code", course.code.toLowerCase());
                courseBox.setAttribute("data-course-name", course.description.toLowerCase());
                courseBox.innerHTML = `
                    <strong>Year Level:</strong> ${course.year_level}<br>
                    <strong>Semester:</strong> ${course.sem} <br>
                    <strong>Course Code:</strong> ${course.code} <br>
                    <strong>Description:</strong> ${course.description}<br>
                    <strong>Credit:</strong> ${course.credit}<br>
                `;
                yearSection.appendChild(courseBox);
            });
    
            courseContainer.appendChild(yearSection);
        }
    
        courseList.appendChild(courseContainer);
    }
    
    // 🔎 Function to filter courses based on search input
    function filterCourses(courses) {
        let searchQuery = document.getElementById("search-bar").value.toLowerCase();
        let courseBoxes = document.querySelectorAll(".course-box");
    
        courseBoxes.forEach(box => {
            let courseCode = box.getAttribute("data-course-code");
            let courseName = box.getAttribute("data-course-name");
    
            if (courseCode.includes(searchQuery) || courseName.includes(searchQuery)) {
                box.style.display = "block";
            } else {
                box.style.display = "none";
            }
        });
    
        // Hide empty year sections
        let yearSections = document.querySelectorAll(".year-section");
        yearSections.forEach(section => {
            let visibleCourses = section.querySelectorAll(".course-box[style='display: block;']");
            section.style.display = visibleCourses.length > 0 ? "block" : "none";
        });
    }

    // Fetch and display course list
    fetchCourseList();
});

// CSS for Clear Button
const style = document.createElement("style");
style.innerHTML = `
    .clear-button {
        margin-left: 10px;
        padding: 5px 10px;
        border: none;
        background-color: #ff8c00;
        color: white;
        cursor: pointer;
        border-radius: 5px;
    }
    .clear-button:hover {
        background-color: #e07b00;
    }
`;
document.head.appendChild(style);
