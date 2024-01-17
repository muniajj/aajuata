function getData() {
    fetch('http://localhost:3000/projects')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let tbody = "";
            data.forEach(project => {
                tbody += "<tr>";
                tbody += "<td>" + project.projectid + "</td>";
                tbody += "<td>" + project.projectname + "</td>";
                tbody += "<td>" + project.empid.join(', ') + "</td>"; // Display employee IDs as a comma-separated string
                
                // Add "Edit" and "Delete" buttons with onclick events
                tbody += "<td> <button onclick=\"editProject('" + project.projectid + "')\">Edit</button></td>";
                tbody += "<td><button onclick=\"deleteProject('" + project.projectid + "')\">Delete</button></td>";
                tbody += "</tr>";
            });
            document.getElementById('tbody').innerHTML = tbody;
        })
        .catch(error => {
            console.error('Error fetching project data:', error);

            // Check if it's a connection issue
            if (error.message.includes('Failed to fetch')) {
                alert('Failed to connect to the server. Please ensure the server is running and try again.');
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        });
}

// Calling this function to initially display the data
getData();

function addProject() {
    // Get values from the input fields
    const projectId = document.getElementById('projectid').value;
    const projectName = document.getElementById('projectname').value;
    const empId = document.getElementById('empid').value.split(',').map(id => id.trim()); // Convert empId to an array of trimmed values

    // Create a new project object
    const newProject = {
        projectid: projectId,
        projectname: projectName,
        empid: empId
    };

    // Send a POST request to add the new project
    fetch('http://localhost:3000/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add project');
        }
        // Clear form fields after successful addition
        document.getElementById('projectid').value = '';
        document.getElementById('projectname').value = '';
        document.getElementById('empid').value = '';
        // Refresh the table data after adding a new project
        getData();
    })
    .catch(error => {
        console.error('Error adding project:', error);
        alert('An error occurred while adding the project. Please try again.');
    });
}
