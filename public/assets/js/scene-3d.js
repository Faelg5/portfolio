/**
 * Scene3D - A lightweight 3D constellation visualizer
 * 
 * Renders nodes as stars in a 3D space that rotates with mouse movement.
 * Supports hover detection and callbacks for UI interaction.
 */

export class Scene3D {
    constructor(canvas, data, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = data; // Array of objects, each needs { title, ... }

        this.options = {
            particleColor: options.particleColor || '#ffb703',
            lineColor: options.lineColor || 'rgba(140, 94, 53, 0.4)',
            bgClickCallback: options.onBgClick || null,
            nodeClickCallback: options.onNodeClick || null,
            nodeHoverCallback: options.onNodeHover || null,
        };

        this.nodes = [];
        this.connections = [];

        // Camera / View settings
        this.fov = 800;
        this.baseRadius = 300; // Cloud radius
        this.rotation = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };

        // Mouse tracking relative to center
        this.mouse = { x: 0, y: 0 };
        this.isHovering = false;
        this.hoverIdx = -1;

        // Perf
        this.width = 0;
        this.height = 0;
        this.cx = 0;
        this.cy = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => this.onMove(e));
        this.canvas.addEventListener('mouseleave', () => {
            this.targetRotation.x = 0;
            this.targetRotation.y = 0;
            this.hoverIdx = -1;
            if (this.options.nodeHoverCallback) this.options.nodeHoverCallback(-1);
        });
        this.canvas.addEventListener('click', (e) => this.onClick(e));

        // Generate 3D positions (Spherical distribution)
        // Fibonacci sphere algo for even distribution
        const count = this.data.length;
        const goldenRatio = (1 + Math.sqrt(5)) / 2;

        for (let i = 0; i < count; i++) {
            const theta = 2 * Math.PI * i / goldenRatio;
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);

            const x = this.baseRadius * Math.sin(phi) * Math.cos(theta);
            const y = this.baseRadius * Math.sin(phi) * Math.sin(theta);
            const z = this.baseRadius * Math.cos(phi);

            this.nodes.push({
                x, y, z,
                ox: x, oy: y, oz: z, // originals
                projX: 0, projY: 0, scale: 0,
                idx: i,
                data: this.data[i]
            });
        }

        // Pre-calculate some random connections for that "constellation" look
        // connecting each node to its 2 nearest neighbors
        this.calculateConnections();

        this.loop();
    }

    resize() {
        this.width = this.canvas.parentElement.clientWidth;
        this.height = this.canvas.parentElement.clientHeight || 500;

        // Handle DPI
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);

        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.cx = this.width / 2;
        this.cy = this.height / 2;
        this.fov = Math.min(this.width, this.height) * 0.9;
    }

    calculateConnections() {
        // Simple distance-based connections would be O(N^2), fine for N=20
        this.connections = [];
        for (let i = 0; i < this.nodes.length; i++) {
            let closest = [];
            const p1 = this.nodes[i];
            for (let j = 0; j < this.nodes.length; j++) {
                if (i === j) continue;
                const p2 = this.nodes[j];
                const dist = Math.sqrt((p1.ox - p2.ox) ** 2 + (p1.oy - p2.oy) ** 2 + (p1.oz - p2.oz) ** 2);
                closest.push({ idx: j, dist });
            }
            closest.sort((a, b) => a.dist - b.dist);
            // Link to 2 closest
            this.connections.push([i, closest[0].idx]);
            this.connections.push([i, closest[1].idx]);
        }
    }

    onMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalize -1 to 1
        const nx = (x - this.cx) / this.cx;
        const ny = (y - this.cy) / this.cy;

        this.mouse.x = x;
        this.mouse.y = y;

        // Target rotation based on mouse pos (inverted for feel)
        this.targetRotation.y = nx * 0.8;
        this.targetRotation.x = -ny * 0.8;
    }

    onClick(e) {
        if (this.hoverIdx !== -1) {
            if (this.options.nodeClickCallback) this.options.nodeClickCallback(this.nodes[this.hoverIdx].idx);
        } else {
            if (this.options.bgClickCallback) this.options.bgClickCallback();
        }
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    update() {
        // Smooth rotation interpolation
        this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.05;
        this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.05;

        // Auto-rotation if idle (optional)
        this.rotation.y += 0.002;

        // Rotation Matrices
        const cosX = Math.cos(this.rotation.x);
        const sinX = Math.sin(this.rotation.x);
        const cosY = Math.cos(this.rotation.y);
        const sinY = Math.sin(this.rotation.y);

        // Hit testing
        let bestDist = 20; // Hit radius
        let bestIdx = -1;

        for (let p of this.nodes) {
            // Rotate Y
            let x1 = p.ox * cosY - p.oz * sinY;
            let z1 = p.ox * sinY + p.oz * cosY;
            // Rotate X
            let y2 = p.oy * cosX - z1 * sinX;
            let z2 = p.oy * sinX + z1 * cosX;

            // Project
            const scale = this.fov / (this.fov + z2);
            p.scale = scale;
            p.projX = this.cx + x1 * scale;
            p.projY = this.cy + y2 * scale;
            p.zDepth = z2; // For z-sorting if needed

            // Interaction check
            // Only check if point is in front of camera (z2 > -fov roughly, but here z=0 is center)
            if (scale > 0 && z2 > -this.fov) {
                const dx = this.mouse.x - p.projX;
                const dy = this.mouse.y - p.projY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < bestDist * scale && dist < bestDist) { // Scale hit area too?
                    // Keep the closest one in terms of distance, but also favour ones in front?
                    // Actually just 2D distance is fine for UI feel
                    bestDist = dist;
                    bestIdx = p.idx;
                }
            }
        }

        if (this.hoverIdx !== bestIdx) {
            this.hoverIdx = bestIdx;
            if (this.options.nodeHoverCallback) {
                this.options.nodeHoverCallback(bestIdx);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw connections
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.options.lineColor;
        this.ctx.lineWidth = 1;
        for (let [i, j] of this.connections) {
            const p1 = this.nodes[i];
            const p2 = this.nodes[j];

            // Don't draw if behind camera
            if (p1.scale <= 0 || p2.scale <= 0) continue;

            // Opacity based on depth
            const alpha = Math.min(1, (p1.scale + p2.scale) / 2 * 0.3);
            this.ctx.globalAlpha = alpha;

            this.ctx.moveTo(p1.projX, p1.projY);
            this.ctx.lineTo(p2.projX, p2.projY);
        }
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;

        // Draw Nodes
        // Sort by Z to draw back-to-front
        this.nodes.sort((a, b) => b.zDepth - a.zDepth);

        for (let p of this.nodes) {
            if (p.scale <= 0) continue;

            let r = 4 * p.scale;
            let alpha = Math.min(1, 0.4 + p.scale * 0.6);

            if (p.idx === this.hoverIdx) {
                r *= 2;
                alpha = 1;
                this.ctx.fillStyle = '#fff'; // Highlight
            } else {
                this.ctx.fillStyle = this.options.particleColor;
            }

            this.ctx.globalAlpha = alpha;
            this.ctx.beginPath();
            this.ctx.arc(p.projX, p.projY, r, 0, Math.PI * 2);
            this.ctx.fill();

            // Glow
            if (p.idx === this.hoverIdx) {
                this.ctx.beginPath();
                this.ctx.arc(p.projX, p.projY, r * 2.5, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(255, 236, 179, 0.3)';
                this.ctx.fill();

                // Text Label
                this.ctx.font = '600 13px system-ui';
                this.ctx.fillStyle = '#ffecb3';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(p.data.title, p.projX, p.projY - r - 8);
            }
        }
    }

    // API to trigger interactions externally
    focusNode(idx) {
        // Could implement a camera fly-to animation here
        // For now just setting highlight
        this.hoverIdx = idx;
    }
}
