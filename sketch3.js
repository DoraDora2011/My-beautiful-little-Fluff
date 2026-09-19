// sketch3.js — Section 8 word cloud (instance mode)

const sketch3 = (p) => {
  const keywords = [
    "Justice", "Family love", "Dad", "Daughter", "Lier",
    "Bribery", "Truth", "Righteous", "Innocence", "Corruption",
    "Deceit", "Fairness", "Paternity", "Honesty", "Perjury"
  ];

  let customFont;
  let wordObjects = [];

  const NUM_WORDS = 10000;
  const APPEARANCE_RATE = 100;
  const NEW_WORD_PER_FRAME = 100;
  let lastWordTime = 0;

  p.preload = () => {
    customFont = p.loadFont("assets/font/ManufacturingConsent-Regular.ttf");
  };

  p.setup = () => {
    // Attach canvas to the Section 8 container
    const holder = document.getElementById("section8-words");
    const canvas = p.createCanvas(holder.offsetWidth, holder.offsetHeight);
    canvas.parent("section8-words");

    p.textFont(customFont);
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();

    for (let i = 0; i < NUM_WORDS; i++) {
      wordObjects.push(new Word());
    }
  };

  p.draw = () => {
    // Keep canvas transparent (no black background)
    p.clear();

    if (p.millis() - lastWordTime > APPEARANCE_RATE) {
      let hiddenWord = wordObjects.find(w => !w.isVisible);
      if (hiddenWord) {
        hiddenWord.show();
        lastWordTime = p.millis();
      }
    }

    for (let word of wordObjects) {
      word.update();
      word.display();
    }
  };

  p.windowResized = () => {
    const holder = document.getElementById("section8-words");
    p.resizeCanvas(holder.offsetWidth, holder.offsetHeight);

    for (let word of wordObjects) {
      if (word.isVisible) {
        word.x = p.random(p.width);
        word.y = p.random(p.height);
      }
    }
  };

  class Word {
    constructor() {
      this.word = p.random(keywords);
      this.fontSize = p.random(20, 120);
      this.color = p.random() > 0.5 ? p.color(255) : p.color(0);
      this.x = p.random(p.width);
      this.y = p.random(p.height);
      this.isVisible = false;
      this.alpha = 0;
      this.targetAlpha = 0;
      this.lifespan = 3000;
      this.timeShown = 0;
    }

    show() {
      this.word = p.random(keywords);
      this.fontSize = p.random(20, 120);
      this.color = p.random() > 0.5 ? p.color(255) : p.color(0);
      this.x = p.random(p.width);
      this.y = p.random(p.height);
      this.isVisible = true;
      this.targetAlpha = 255;
      this.timeShown = p.millis();
    }

    update() {
      if (!this.isVisible) return;

      let elapsedTime = p.millis() - this.timeShown;
      if (elapsedTime > this.lifespan) this.targetAlpha = 0;

      this.alpha = p.lerp(this.alpha, this.targetAlpha, 0.05);

      if (this.alpha < 1 && this.targetAlpha === 0) {
        this.isVisible = false;
      }
    }

    display() {
      if (!this.isVisible) return;

      let displayColor = this.color;
      displayColor.setAlpha(this.alpha);

      p.fill(displayColor);
      p.textSize(this.fontSize);
      p.text(this.word, this.x, this.y);
    }
  }
};

// Run sketch 3 only in Section 8
new p5(sketch3);
