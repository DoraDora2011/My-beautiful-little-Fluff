let luckyCharmImg;
let flowerClusters = [];

// clusters count and size range
let maxClusters = 35;
let minClusterSize = 200;
let maxClusterSize = 400;
let frameRateForNewCluster = 30;

// overlay colors for clusters
const overlayColors = ["#c21e36ff", "#ebd08cff", "#820b8dff", "#88cfebff", "#2d8d96"];

// full-screen fade overlay
let screenOverlayAlpha = 180;
let overlayFadeSpeed = 1.5;
let screenOverlayColor;

let section4Container; // div #section4-canvas
let cnv;               // p5 canvas

function preload() {
  luckyCharmImg = loadImage("assets/Butterfly GIF section 1.gif");
}

function setup() {
  section4Container = document.getElementById("section4-canvas");

  if (!section4Container) {
    noCanvas();
    return;
  }

  const rect = section4Container.getBoundingClientRect();

  cnv = createCanvas(rect.width, rect.height);
  cnv.parent("section4-canvas");

  imageMode(CENTER);
  noStroke();

  screenOverlayColor = color(0, 0, 0, screenOverlayAlpha);

  // transparent background
  clear();
}

function draw() {
  if (!section4Container) return;

  // clear to transparent each frame
  clear();

  // spawn new cluster periodically
  if (frameCount % frameRateForNewCluster === 0) {
    if (flowerClusters.length < maxClusters) {
      flowerClusters.push(new FlowerCluster());
    }
  }

  // update and draw clusters
  for (let i = flowerClusters.length - 1; i >= 0; i--) {
    const cluster = flowerClusters[i];
    cluster.update();
    cluster.display();

    if (cluster.isFinished()) {
      flowerClusters.splice(i, 1);
    }
  }

  // draw fade overlay
  drawScreenOverlay();
}

class FlowerCluster {
  constructor() {
    this.x = random(width);
    this.y = random(height);

    this.initialSize = 5;
    this.targetSize = random(minClusterSize, maxClusterSize);
    this.currentSize = this.initialSize;

    this.alpha = 0;
    this.growing = true;
    this.bloomed = false;
    this.isFull = false;

    this.childCharms = [];

    // pick an overlay color for the cluster
    this.chosenOverlayColor = color(random(overlayColors));

    let numChildren = floor(random(5, 12));
    for (let i = 0; i < numChildren; i++) {
      this.childCharms.push({
        angle: random(TWO_PI),
        dist: random(this.targetSize * 0.2, this.targetSize * 0.5),
        rotationSpeed: random(-0.02, 0.02),
        size: random(30, 80)
      });
    }
  }

  update() {
    if (this.growing) {
      // smoothly grow and fade in
      this.currentSize = lerp(this.currentSize, this.targetSize, 0.09);
      this.alpha = lerp(this.alpha, 255, 0.10);

      if (abs(this.currentSize - this.targetSize) < 1) {
        this.growing = false;
        this.bloomed = true;
      }
    } else if (this.bloomed) {
      if (!this.isFull && this.childCharms.length > 0) {
        this.isFull = true;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    // apply cluster tint and draw main charm
    tint(
      red(this.chosenOverlayColor),
      green(this.chosenOverlayColor),
      blue(this.chosenOverlayColor),
      this.alpha
    );
    image(luckyCharmImg, 0, 0, this.currentSize, this.currentSize);

    // draw rotating child charms
    for (let charm of this.childCharms) {
      push();
      rotate(charm.angle + frameCount * charm.rotationSpeed);

      tint(
        red(this.chosenOverlayColor),
        green(this.chosenOverlayColor),
        blue(this.chosenOverlayColor),
        this.alpha
      );

      image(
        luckyCharmImg,
        cos(charm.angle) * charm.dist,
        sin(charm.angle) * charm.dist,
        charm.size,
        charm.size
      );
      pop();
    }

    pop();
    noTint();
  }

  isFinished() {
    // clusters currently don't auto-remove
    return false;
  }
}

function drawScreenOverlay() {
  if (screenOverlayAlpha > 0) {
    screenOverlayAlpha = max(0, screenOverlayAlpha - overlayFadeSpeed);
    screenOverlayColor.setAlpha(screenOverlayAlpha);
  }

  noStroke();
  fill(screenOverlayColor);
  rect(0, 0, width, height);
}

function windowResized() {
  if (!section4Container || !cnv) return;

  const rect = section4Container.getBoundingClientRect();
  resizeCanvas(rect.width, rect.height);
}
