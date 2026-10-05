const algorithms = [
    {
        title: "Shor's Algorithm",
        subtitle: "Factorizing large numbers via quantum periodicity calculation.",
        steps: [
            "Step 1: Superposition state initialized across control register qubits.",
            "Step 2: Executing modular exponentiation transformation f(x) = a^x mod N.",
            "Step 3: Performing Inverse Quantum Fourier Transform (QFT†) extraction.",
            "Step 4: Measuring register states to compute prime factors via GCD."
        ]
    },
    {
        title: "Grover's Algorithm",
        subtitle: "Unstructured database search achieving quadratic speedup.",
        steps: [
            "Step 1: Initializing uniform superposition across all search target states.",
            "Step 2: Applying Oracle operator (Uω) to phase-invert the matching item.",
            "Step 3: Applying Diffusion operator to amplify target state amplitudes.",
            "Step 4: Measuring final state vector to isolate winning target item."
        ]
    },
    {
        title: "Quantum Fourier Transform",
        subtitle: "The quantum equivalent of discrete Fourier transforms.",
        steps: [
            "Step 1: Applying Hadamard gate to target qubit for initial phase split.",
            "Step 2: Executing controlled phase rotation gates (Rk) sequentially.",
            "Step 3: Recursively scaling phase angles across remaining qubits.",
            "Step 4: Performing qubit position swap reordering operations."
        ]
    },
    {
        title: "Quantum Phase Estimation",
        subtitle: "Estimating eigenvalue phase angles of unitary operators.",
        steps: [
            "Step 1: Setting up control register in equal superposition via Hadamards.",
            "Step 2: Applying controlled-unitary operations scaled by binary weights.",
            "Step 3: Executing Inverse QFT mapping onto computational basis states.",
            "Step 4: Reading output estimation bits for exact eigenvalue angle."
        ]
    },
    {
        title: "Deutsch-Jozsa Algorithm",
        subtitle: "Determining constant vs balanced boolean functions.",
        steps: [
            "Step 1: Initializing input register to |0⟩ and auxiliary target to |1⟩.",
            "Step 2: Applying Hadamard gates across all qubits to form superposition.",
            "Step 3: Querying quantum oracle function producing phase kickback.",
            "Step 4: Final Hadamard interference reading constant vs balanced states."
        ]
    }
];

let currentAlgo = 0;
let currentStep = 0;

// --- THREE.JS 3D SCENE SETUP ---
const container = document.getElementById("webglCanvasContainer");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.insertBefore(renderer.domElement, container.firstChild);

// Add Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00eaff, 2, 50);
pointLight.position.set(0, 3, 5);
scene.add(pointLight);

// Create 3D Quantum Objects Group
const quantumGroup = new THREE.Group();
scene.add(quantumGroup);

let qubits = [];

function build3DSceneForStep() {
    // Clear previous 3D objects
    while(quantumGroup.children.length > 0){ 
        quantumGroup.remove(quantumGroup.children[0]); 
    }
    qubits = [];

    const nodeCount = 4;
    const spacing = 2.2;
    const startX = -((nodeCount - 1) * spacing) / 2;

    for (let i = 0; i < nodeCount; i++) {
        // Create Glowing Spheres for Qubits / Gates
        const geometry = new THREE.SphereGeometry(0.6, 32, 32);
        const isActive = (i === currentStep);
        
        const material = new THREE.MeshPhysicalMaterial({
            color: isActive ? 0xffffff : 0x00d9ff,
            emissive: isActive ? 0x00eaff : 0x003366,
            emissiveIntensity: isActive ? 0.8 : 0.3,
            roughness: 0.1,
            metalness: 0.2,
            transmission: 0.6, // Glassmorphism effect in 3D
            transparent: true,
            opacity: 0.9
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(startX + (i * spacing), 0, 0);
        quantumGroup.add(sphere);
        qubits.push(sphere);

        // Add connecting circuit wires between nodes
        if (i < nodeCount - 1) {
            const lineGeo = new THREE.CylinderGeometry(0.04, 0.04, spacing, 16);
            const lineMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });
            const line = new THREE.Mesh(lineGeo, lineMat);
            line.rotation.z = Math.PI / 2;
            line.position.set(startX + (i * spacing) + (spacing / 2), 0, 0);
            quantumGroup.add(line);
        }
    }
}

// Animation loop for smooth 3D rotation
function animate() {
    requestAnimationFrame(animate);
    
    // Gentle floating rotation
    quantumGroup.rotation.y += 0.005;
    quantumGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;

    renderer.render(scene, camera);
}
animate();

// --- UI CONTROLS & LOGIC ---
function selectAlgorithm(index) {
    currentAlgo = index;
    currentStep = 0;

    document.querySelectorAll('.algo-btn').forEach((btn, idx) => {
        if (idx === index) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    updateUI();
}

function updateUI() {
    const data = algorithms[currentAlgo];
    
    document.getElementById("algoTitle").textContent = data.title;
    document.getElementById("algoSubtitle").textContent = data.subtitle;
    document.getElementById("stepCounter").textContent = `Step ${currentStep + 1} of ${data.steps.length}`;
    document.getElementById("stepDescription").textContent = data.steps[currentStep];

    document.getElementById("prevBtn").disabled = currentStep === 0;
    document.getElementById("nextBtn").disabled = currentStep === data.steps.length - 1;

    build3DSceneForStep();
}

function changeStep(direction) {
    const data = algorithms[currentAlgo];
    currentStep += direction;

    if (currentStep < 0) currentStep = 0;
    if (currentStep >= data.steps.length) currentStep = data.steps.length - 1;

    updateUI();
}

// Window resizing handler for 3D viewport
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Initial Render Call
updateUI();