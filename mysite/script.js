// Constants
const sceneContainer = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
sceneContainer.appendChild(renderer.domElement);

// Create lines that follow the cursor
const numPentagons = 4;
const linesPerPentagon = 5;
const lineLength = 1; // Adjust the line length for smaller pentagons
const lineWidth = 0.1; // Adjust the line thickness
const lines = [];


// Track the cursor position
const mouse = new THREE.Vector2();
const centralPoint = new THREE.Vector2();

// Calculate the center position
let centerX = 0;
let centerY = 0;

// Sensitivity multipliers for line movement
let sensitivityX = 0.5; // Adjust this value for X-axis sensitivity
let sensitivityY = 0.5; // Adjust this value for Y-axis sensitivity

// Function to update sensitivity values based on window size
function updateSensitivity() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    sensitivityX = 4.6 * (aspectRatio > 1 ? aspectRatio : 1); // Adjust this value for X-axis sensitivity
    sensitivityY = 4.55 * (aspectRatio < 1 ? 1 / aspectRatio : 1); // Adjust this value for Y-axis sensitivity
}

// Initialize sensitivity values
updateSensitivity();

// Handle mousemove event to update line positions
window.addEventListener('mousemove', (event) => {
    // Calculate the normalized mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the central point based on mouse position with sensitivities
    centralPoint.x = centerX + mouse.x * sensitivityX; // Adjust the X-axis sensitivity
    centralPoint.y = centerY + mouse.y * sensitivityY; // Adjust the Y-axis sensitivity

    // Update line positions based on mouse position
    for (let i = 0; i < numPentagons; i++) {
        const radius = ((i + 1) * lineLength * 2); // Adjust the multiplier for spacing
        const angleStep = (Math.PI * 2) / linesPerPentagon;

        for (let j = 0; j < linesPerPentagon; j++) {
            const angle = angleStep * j + ((Math.PI / 5) * i); // Offset angle for pentagon shape
            const index = i * linesPerPentagon + j;
            const line = lines[index];

            // Calculate the line position based on center and radius
            line.position.x = centerX + Math.cos(angle) * radius;
            line.position.y = centerY + Math.sin(angle) * radius;

            // Update the end of the line to follow the cursor
            const lineEndPointX = centralPoint.x - line.position.x;
            const lineEndPointY = centralPoint.y - line.position.y;
            line.geometry.vertices[1].set(lineEndPointX, lineEndPointY, -lineLength);
            line.geometry.verticesNeedUpdate = true;
        }
    }
});

// Handle window resizing
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);

    // Recalculate the center position based on the new window size
    centerX = 0;
    centerY = 0;

    // Update sensitivity values based on the new window size
    updateSensitivity();

    // Update the central point based on the new center position with updated sensitivities
    centralPoint.x = centerX + mouse.x * sensitivityX;
    centralPoint.y = centerY + mouse.y * sensitivityY;
});

// Create central line
const centralLineGeometry = new THREE.Geometry();
centralLineGeometry.vertices.push(new THREE.Vector3(centerX, centerY, 0));
centralLineGeometry.vertices.push(new THREE.Vector3(centerX, centerY, -lineLength));

const centralLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: lineWidth });
const centralLine = new THREE.Line(centralLineGeometry, centralLineMaterial);
scene.add(centralLine);

// Create concentric pentagons
for (let i = 0; i < numPentagons; i++) {
    const radius = ((i + 1) * lineLength * 2); // Adjust the multiplier for spacing
    const angleStep = (Math.PI * 2) / linesPerPentagon;

    for (let j = 0; j < linesPerPentagon; j++) {
        const angle = angleStep * j + ((Math.PI / 5) * i); // Offset angle for pentagon shape
        const index = i * linesPerPentagon + j;
        const lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, -lineLength));

        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: lineWidth });
        const line = new THREE.Line(lineGeometry, lineMaterial);

        // Calculate the line position based on center and radius
        line.position.x = centerX + Math.cos(angle) * radius;
        line.position.y = centerY + Math.sin(angle) * radius;

        // Update the end of the line to follow the cursor
        const lineEndPointX = centralPoint.x - line.position.x;
        const lineEndPointY = centralPoint.y - line.position.y;
        line.geometry.vertices[1].set(lineEndPointX, lineEndPointY, -lineLength);
        line.geometry.verticesNeedUpdate = true;

        lines.push(line);
        scene.add(line);
    }
}

// Position the camera
camera.position.z = 5;

// Animation function
const animate = () => {
    requestAnimationFrame(animate);

    // Render the scene
    renderer.render(scene, camera);
};

// Start the animation loop
animate();