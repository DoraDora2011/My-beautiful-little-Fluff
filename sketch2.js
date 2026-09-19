// Blood Flow / Vein Flow Field – instance mode for sections 5 and 6

const NUM_PARTICLES = 800;   // number of "blood" particles
const SPEED          = 1.5;  // flow speed
const NOISE_SCALE    = 0.003;

// Create a vein sketch attached to containerId
function createVeinSketch(containerId) {
    new p5(function (p) {

        let particles = [];
        let zoff = 0;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.pos   = p.createVector(p.random(p.width), p.random(p.height));
                this.prev  = this.pos.copy();
                this.weight = p.random(1, 3);
                this.hue    = p.random(350, 360);   // blood red
            }

            update() {
                this.prev.set(this.pos);

                const angle = p.noise(
                    this.pos.x * NOISE_SCALE,
                    this.pos.y * NOISE_SCALE,
                    zoff
                ) * p.TWO_PI * 4.0;

                const v = p5.Vector.fromAngle(angle);
                v.setMag(SPEED);
                this.pos.add(v);

                // respawn when leaving canvas
                if (
                    this.pos.x < -10 || this.pos.x > p.width + 10 ||
                    this.pos.y < -10 || this.pos.y > p.height + 10
                ) {
                    this.reset();
                    this.prev.set(this.pos);
                }
            }

            show() {
                p.strokeWeight(this.weight);
                p.stroke(this.hue % 360, 80, 95, 0.18); // HSB
                p.line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);
            }
        }

        p.setup = function () {
            const container = document.getElementById(containerId);
            if (!container) return;

            const w = container.offsetWidth;
            const h = container.offsetHeight;

            const cnv = p.createCanvas(w, h);
            cnv.parent(container); // parent of the instance

            p.colorMode(p.HSB, 360, 100, 100, 1);
            p.noFill();

            // Keep canvas transparent so only streaks are visible
            p.clear();

            particles = [];
            for (let i = 0; i < NUM_PARTICLES; i++) {
                particles.push(new Particle());
            }
        };

        p.draw = function () {
            // Don't clear background — trails accumulate
            for (let part of particles) {
                part.update();
                part.show();
            }
            zoff += 0.002;
        };

        p.windowResized = function () {
            const container = document.getElementById(containerId);
            if (!container) return;

            const w = container.offsetWidth;
            const h = container.offsetHeight;
            p.resizeCanvas(w, h);

            p.clear();
            particles = [];
            for (let i = 0; i < NUM_PARTICLES; i++) {
                particles.push(new Particle());
            }
        };
    }, containerId);
}

// On DOM load, create two sketches: sections 5 and 6
window.addEventListener("load", function () {
    if (document.getElementById("section5-veins")) {
        createVeinSketch("section5-veins");
    }
    if (document.getElementById("section6-veins")) {
        createVeinSketch("section6-veins");
    }
});
