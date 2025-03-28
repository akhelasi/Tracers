let numShapes = 500; // How many figures (Shapes, Geometries)
let numTrianglesInShape = 200; // How many "triangles" in one figure (Shape)
// "triangles" რაოდენობა = numShapes * numTrianglesInShape

AFRAME.registerComponent('generate-shapes', {
    init: function () {
        const shapeContainer = this.el;
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff]; // Array of colors

        for (let i = 0; i < numShapes; i++) {
            const shapeGeometry = new THREE.BufferGeometry();

            // Generate "numTrianglesInShape * 9" random vertices (0 or 1) for "numTrianglesInShape" triangles
            const vertices = new Float32Array(numTrianglesInShape * 9);
            for (let j = 0; j < numTrianglesInShape * 9; j++) {
                vertices[j] = Math.random() < 0.5 ? 0 : 1;
            }
            shapeGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

            // Randomly select a color from the array
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const shapeMaterial = new THREE.MeshBasicMaterial({ color: randomColor, side: THREE.DoubleSide });

            const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
            shape.position.set(Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25);
            shapeContainer.setObject3D(`shape${i}`, shape);
        }

        this.startPerformanceMeasurement();
    },

    startPerformanceMeasurement: function () {
        const fpsDisplay = document.getElementById('fpsDisplay').children;
        let frameCount = 0;
        let startTime = performance.now();

        const updatePerformanceMetrics = () => {
            const currentTime = performance.now();
            const elapsedTime = (currentTime - startTime) / 1000; // in seconds
            const avgTimePerFrame = elapsedTime / frameCount;
            const triangles = numShapes * numTrianglesInShape;
            const avgTimePerTriangle = avgTimePerFrame / triangles;

            fpsDisplay[1].textContent = `Triangles(Tr): ${triangles}`;
            fpsDisplay[2].textContent = `draw calls(Geometries): ${numShapes}`;
            fpsDisplay[3].textContent = `(ATP) frame: ${avgTimePerFrame.toFixed(6)} seconds`;
            fpsDisplay[4].textContent = `(ATP) (Tr): ${avgTimePerTriangle.toFixed(9)} seconds`;
        };

        const measure = () => {
            frameCount++;
            requestAnimationFrame(measure);
        };

        measure();
        setInterval(updatePerformanceMetrics, 1000);
    }
});

document.querySelector('#shapes').setAttribute('generate-shapes', '');
