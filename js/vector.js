// Vector visualization using p5.js
let vectorSketch = function(p) {
  // Vector properties
  let fx = 5;
  let fy = 3;
  let angle = 30;
  let magnitude = 0;
  
  // Canvas dimensions
  let width = 0;
  let height = 0;
  
  // Origin point (center of canvas)
  let originX = 0;
  let originY = 0;
  
  // Scale factor for visualization
  let scale = 20;
  
  p.setup = function() {
    // Create canvas that fills the container
    let container = document.getElementById('vectors-canvas');
    width = container.offsetWidth;
    height = container.offsetHeight;
    let canvas = p.createCanvas(width, height);
    canvas.parent('vectors-canvas');
    
    // Set origin to center of canvas
    originX = width / 2;
    originY = height / 2;
    
    // Initialize vector values
    updateVectorValues();
    
    // Set up event listeners for sliders
    document.getElementById('vector-fx').addEventListener('input', function() {
      fx = parseFloat(this.value);
      document.getElementById('vector-fx-value').textContent = fx;
      updateVectorValues();
    });
    
    document.getElementById('vector-fy').addEventListener('input', function() {
      fy = parseFloat(this.value);
      document.getElementById('vector-fy-value').textContent = fy;
      updateVectorValues();
    });
    
    document.getElementById('vector-angle').addEventListener('input', function() {
      angle = parseFloat(this.value);
      document.getElementById('vector-angle-value').textContent = angle + '°';
      
      // When angle is changed, update fx and fy
      let radians = p.radians(angle);
      magnitude = Math.sqrt(fx * fx + fy * fy);
      fx = magnitude * Math.cos(radians);
      fy = magnitude * Math.sin(radians);
      
      // Update slider values
      document.getElementById('vector-fx').value = fx.toFixed(1);
      document.getElementById('vector-fy').value = fy.toFixed(1);
      document.getElementById('vector-fx-value').textContent = fx.toFixed(1);
      document.getElementById('vector-fy-value').textContent = fy.toFixed(1);
      
      updateVectorValues();
    });
  };
  
  p.draw = function() {
    p.background(249, 249, 249);
    
    // Draw coordinate system
    drawCoordinateSystem();
    
    // Draw main vector
    drawVector(originX, originY, fx * scale, -fy * scale, p.color(255, 0, 0), 3);
    
    // Draw component vectors
    drawVector(originX, originY, fx * scale, 0, p.color(0, 0, 255), 2);
    drawVector(originX + fx * scale, originY, 0, -fy * scale, p.color(0, 0, 255), 2);
    
    // Draw labels
    drawLabels();
  };
  
  function drawCoordinateSystem() {
    p.stroke(150);
    p.strokeWeight(1);
    
    // Draw grid
    let gridSize = 20;
    for (let x = 0; x < width; x += gridSize) {
      p.line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      p.line(0, y, width, y);
    }
    
    // Draw axes
    p.stroke(0);
    p.strokeWeight(2);
    p.line(0, originY, width, originY); // x-axis
    p.line(originX, 0, originX, height); // y-axis
    
    // Draw axis labels
    p.noStroke();
    p.fill(0);
    p.textSize(16);
    p.textAlign(p.CENTER, p.TOP);
    p.text("x", width - 20, originY + 10);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("y", originX + 10, 20);
  }
  
  function drawVector(x1, y1, dx, dy, color, weight) {
    p.push();
    p.stroke(color);
    p.strokeWeight(weight);
    p.fill(color);
    
    // Draw line
    p.line(x1, y1, x1 + dx, y1 + dy);
    
    // Draw arrowhead
    let angle = p.atan2(dy, dx);
    let arrowSize = 10;
    p.translate(x1 + dx, y1 + dy);
    p.rotate(angle);
    p.triangle(0, 0, -arrowSize, arrowSize/2, -arrowSize, -arrowSize/2);
    p.pop();
  }
  
  function drawLabels() {
    p.noStroke();
    p.fill(0);
    p.textSize(14);
    
    // Label for main vector
    p.textAlign(p.CENTER);
    let labelX = originX + (fx * scale) / 2;
    let labelY = originY + (-fy * scale) / 2;
    p.text("F", labelX, labelY - 10);
    
    // Labels for components
    p.textAlign(p.CENTER, p.TOP);
    p.text("Fₓ = " + fx.toFixed(1), originX + (fx * scale) / 2, originY + 5);
    
    p.textAlign(p.RIGHT, p.CENTER);
    p.text("Fᵧ = " + fy.toFixed(1), originX - 5, originY + (-fy * scale) / 2);
    
    // Magnitude and angle
    p.textAlign(p.LEFT, p.TOP);
    p.text("Magnitude: " + magnitude.toFixed(2), 20, 20);
    p.text("Angle: " + angle.toFixed(1) + "°", 20, 40);
  }
  
  function updateVectorValues() {
    if (isNaN(fx) || isNaN(fy)) {
      console.error("Error: Invalid vector components.");
      return;
    }
    // Calculate magnitude and angle from components
    magnitude = Math.sqrt(fx * fx + fy * fy);
    angle = p.degrees(Math.atan2(fy, fx));
    if (angle < 0) {
      angle += 360;
    }
    
    // Update formula display using KaTeX
    let formulaElement = document.getElementById('vector-formula');
    let formula = `F = \\sqrt{F_x^2 + F_y^2} = \\sqrt{(${fx.toFixed(1)})^2 + (${fy.toFixed(1)})^2} = ${magnitude.toFixed(2)}\\\\
                  \\theta = \\arctan\\left(\\frac{F_y}{F_x}\\right) = \\arctan\\left(\\frac{${fy.toFixed(1)}}{${fx.toFixed(1)}}\\right) = ${angle.toFixed(1)}°`;
    
    katex.render(formula, formulaElement);
    
    // Update angle slider without triggering event
    let angleSlider = document.getElementById('vector-angle');
    if (Math.abs(parseFloat(angleSlider.value) - angle) > 1) {
      angleSlider.value = angle;
      document.getElementById('vector-angle-value').textContent = angle.toFixed(1) + '°';
    }
  }
  
  // Handle window resize
  p.windowResized = function() {
    let container = document.getElementById('vectors-canvas');
    width = container.offsetWidth;
    height = container.offsetHeight;
    p.resizeCanvas(width, height);
    originX = width / 2;
    originY = height / 2;
  };
};

// Create the vector sketch instance
new p5(vectorSketch);
