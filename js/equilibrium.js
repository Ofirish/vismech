// Equilibrium visualization using p5.js
let equilibriumSketch = function(p) {
  // Forces array
  let forces = [];
  
  // Default forces (two opposing forces)
  let f1 = 5;
  let theta1 = 0;
  let f2 = 5;
  let theta2 = 180;
  
  // Canvas dimensions
  let width = 0;
  let height = 0;
  
  // Origin point (center of canvas)
  let originX = 0;
  let originY = 0;
  
  // Scale factor for visualization
  let scale = 20;
  
  // Maximum number of forces
  let maxForces = 5;
  
  p.setup = function() {
    // Create canvas that fills the container
    let container = document.getElementById('equilibrium-canvas');
    width = container.offsetWidth;
    height = container.offsetHeight;
    let canvas = p.createCanvas(width, height);
    canvas.parent('equilibrium-canvas');
    
    // Set origin to center of canvas
    originX = width / 2;
    originY = height / 2;
    
    // Initialize forces
    forces = [
      { magnitude: f1, angle: theta1 },
      { magnitude: f2, angle: theta2 }
    ];
    
    // Set up event listeners for sliders
    document.getElementById('equilibrium-f1').addEventListener('input', function() {
      f1 = parseFloat(this.value);
      document.getElementById('equilibrium-f1-value').textContent = f1 + ' N';
      forces[0].magnitude = f1;
      updateFormulaDisplay();
    });
    
    document.getElementById('equilibrium-theta1').addEventListener('input', function() {
      theta1 = parseFloat(this.value);
      document.getElementById('equilibrium-theta1-value').textContent = theta1 + '°';
      forces[0].angle = theta1;
      updateFormulaDisplay();
    });
    
    document.getElementById('equilibrium-f2').addEventListener('input', function() {
      f2 = parseFloat(this.value);
      document.getElementById('equilibrium-f2-value').textContent = f2 + ' N';
      forces[1].magnitude = f2;
      updateFormulaDisplay();
    });
    
    document.getElementById('equilibrium-theta2').addEventListener('input', function() {
      theta2 = parseFloat(this.value);
      document.getElementById('equilibrium-theta2-value').textContent = theta2 + '°';
      forces[1].angle = theta2;
      updateFormulaDisplay();
    });
    
    // Add force button
    document.getElementById('equilibrium-add-force').addEventListener('click', function() {
      if (forces.length < maxForces) {
        forces.push({ magnitude: 3, angle: 90 });
        updateFormulaDisplay();
      }
    });
    
    // Remove force button
    document.getElementById('equilibrium-remove-force').addEventListener('click', function() {
      if (forces.length > 2) {
        forces.pop();
        updateFormulaDisplay();
      }
    });
    
    // Initial formula display
    updateFormulaDisplay();
  };
  
  p.draw = function() {
    p.background(249, 249, 249);
    
    // Draw coordinate system
    drawCoordinateSystem();
    
    // Draw forces
    drawForces();
    
    // Draw resultant force
    drawResultant();
    
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
  
  function drawForces() {
    // Colors for different forces
    let colors = [
      p.color(255, 0, 0),    // Red
      p.color(0, 0, 255),    // Blue
      p.color(0, 128, 0),    // Green
      p.color(128, 0, 128),  // Purple
      p.color(255, 165, 0)   // Orange
    ];
    
    // Draw each force
    for (let i = 0; i < forces.length; i++) {
      let force = forces[i];
      let radians = p.radians(force.angle);
      let fx = force.magnitude * Math.cos(radians);
      let fy = force.magnitude * Math.sin(radians);
      
      // Draw vector
      drawVector(originX, originY, fx * scale, -fy * scale, colors[i], 3);
      
      // Draw label
      p.noStroke();
      p.fill(colors[i]);
      p.textSize(16);
      p.textAlign(p.CENTER);
      
      let labelX = originX + (fx * scale) / 2;
      let labelY = originY + (-fy * scale) / 2;
      p.text("F" + (i+1), labelX, labelY - 10);
    }
  }
  
  function drawResultant() {
    // Calculate resultant force
    let resultantX = 0;
    let resultantY = 0;
    
    for (let force of forces) {
      let radians = p.radians(force.angle);
      resultantX += force.magnitude * Math.cos(radians);
      resultantY += force.magnitude * Math.sin(radians);
    }
    
    // Draw resultant vector (dashed line)
    p.push();
    p.stroke(0);
    p.strokeWeight(2);
    
    // Draw dashed line
    let dashLength = 5;
    let totalLength = Math.sqrt(Math.pow(resultantX * scale, 2) + Math.pow(-resultantY * scale, 2));
    let numDashes = Math.floor(totalLength / (dashLength * 2));
    
    for (let i = 0; i < numDashes; i++) {
      let t1 = i / numDashes;
      let t2 = (i + 0.5) / numDashes;
      
      let x1 = p.lerp(originX, originX + resultantX * scale, t1);
      let y1 = p.lerp(originY, originY + -resultantY * scale, t1);
      let x2 = p.lerp(originX, originX + resultantX * scale, t2);
      let y2 = p.lerp(originY, originY + -resultantY * scale, t2);
      
      p.line(x1, y1, x2, y2);
    }
    
    // Draw arrowhead if resultant is not zero
    if (Math.abs(resultantX) > 0.1 || Math.abs(resultantY) > 0.1) {
      let angle = Math.atan2(-resultantY, resultantX);
      let arrowSize = 10;
      p.translate(originX + resultantX * scale, originY + -resultantY * scale);
      p.rotate(angle);
      p.fill(0);
      p.triangle(0, 0, -arrowSize, arrowSize/2, -arrowSize, -arrowSize/2);
    }
    p.pop();
    
    // Draw resultant label
    p.noStroke();
    p.fill(0);
    p.textSize(16);
    p.textAlign(p.CENTER);
    
    let labelX = originX + (resultantX * scale) / 2;
    let labelY = originY + (-resultantY * scale) / 2;
    
    if (Math.abs(resultantX) > 0.1 || Math.abs(resultantY) > 0.1) {
      p.text("ΣF", labelX, labelY - 15);
    }
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
    // Calculate resultant force
    let resultantX = 0;
    let resultantY = 0;
    
    for (let force of forces) {
      let radians = p.radians(force.angle);
      resultantX += force.magnitude * Math.cos(radians);
      resultantY += force.magnitude * Math.sin(radians);
    }
    
    // Draw information text
    p.push();
    p.fill(0);
    p.noStroke();
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text("ΣFₓ = " + resultantX.toFixed(2) + " N", 20, 20);
    p.text("ΣFᵧ = " + resultantY.toFixed(2) + " N", 20, 50);
    
    // Check if system is in equilibrium
    let isEquilibrium = Math.abs(resultantX) < 0.1 && Math.abs(resultantY) < 0.1;
    p.textSize(18);
    p.text("Equilibrium: " + (isEquilibrium ? "Yes" : "No"), 20, 80);
    p.pop();
  }
  
  function updateFormulaDisplay() {
    // Calculate sum of forces in x and y directions
    let sumFx = 0;
    let sumFy = 0;
    
    let formulaX = "\\sum F_x = ";
    let formulaY = "\\sum F_y = ";
    
    for (let i = 0; i < forces.length; i++) {
      let force = forces[i];
      let radians = p.radians(force.angle);
      let fx = force.magnitude * Math.cos(radians);
      let fy = force.magnitude * Math.sin(radians);
      
      sumFx += fx;
      sumFy += fy;
      
      // Add to formula
      formulaX += (i > 0 ? " + " : "") + "F_{" + (i+1) + "} \\cos(" + force.angle + "^\\circ)";
      formulaY += (i > 0 ? " + " : "") + "F_{" + (i+1) + "} \\sin(" + force.angle + "^\\circ)";
    }
    
    formulaX += " = " + sumFx.toFixed(2) + " \\text{ N}";
    formulaY += " = " + sumFy.toFixed(2) + " \\text{ N}";
    
    // Update formula display using KaTeX
    let formulaElement = document.getElementById('equilibrium-formula');
    let formula = formulaX + "\\\\" + formulaY;
    
    katex.render(formula, formulaElement);
  }
  
  // Handle window resize
  p.windowResized = function() {
    let container = document.getElementById('equilibrium-canvas');
    width = container.offsetWidth;
    height = container.offsetHeight;
    p.resizeCanvas(width, height);
    originX = width / 2;
    originY = height / 2;
  };
};

// Create the equilibrium sketch instance
new p5(equilibriumSketch);
