// Stress/Strain visualization using p5.js
let stressStrainSketch = function(p) {
  // Parameters
  let force = 500;      // Force in N
  let area = 50;        // Cross-sectional area in mm²
  let youngsModulus = 200; // Young's modulus in GPa
  
  // Calculated values
  let stress = 0;       // Stress in MPa
  let strain = 0;       // Strain (dimensionless)
  let elongation = 0;   // Elongation in mm
  
  // Bar dimensions
  let barWidth = 0;
  let barHeight = 0;
  let originalLength = 0;
  let deformedLength = 0;
  
  // Canvas dimensions
  let width = 0;
  let height = 0;
  
  // Animation properties
  let animationTime = 0;
  let animationDuration = 60;
  let animating = true;
  
  // Scale factor for visualization
  let scaleFactor = 500; // Amplify deformation for visibility
  
  p.setup = function() {
    // Create canvas that fills the container
    let container = document.getElementById('stress-strain-canvas');
    width = container.offsetWidth;
    height = container.offsetHeight;
    let canvas = p.createCanvas(width, height);
    canvas.parent('stress-strain-canvas');
    
    // Set bar dimensions
    barWidth = width * 0.6;
    barHeight = height * 0.2;
    originalLength = barWidth;
    
    // Calculate initial values
    calculateStressStrain();
    
    // Set up event listeners for sliders
    document.getElementById('stress-force').addEventListener('input', function() {
      let input = parseFloat(this.value);
      if (isNaN(input) || input < 0) {
        console.error("Invalid force value.");
        return;
      }
      force = input;
      document.getElementById('stress-force-value').textContent = force + ' N';
      calculateStressStrain();
      resetAnimation();
    });

    document.getElementById('stress-area').addEventListener('input', function() {
      let input = parseFloat(this.value);
      if (isNaN(input) || input <= 0) {
        console.error("Invalid area value.");
        return;
      }
      area = input;
      document.getElementById('stress-area-value').textContent = area + ' mm²';
      calculateStressStrain();
      resetAnimation();
    });

    document.getElementById('stress-modulus').addEventListener('input', function() {
      let input = parseFloat(this.value);
      if (isNaN(input) || input <= 0) {
        console.error("Invalid Young's modulus value.");
        return;
      }
      youngsModulus = input;
      document.getElementById('stress-modulus-value').textContent = youngsModulus + ' GPa';
      calculateStressStrain();
      resetAnimation();
    });

    // Update formula display
    updateFormulaDisplay();
  };
  
  p.draw = function() {
    p.background(249, 249, 249);

    // Update animation
    if (animating) {
      animationTime++;
      if (animationTime >= animationDuration) {
        animating = false;
      }
    }

    // Calculate current deformation based on animation time
    let animationProgress = animating ? animationTime / animationDuration : 1;
    deformedLength = originalLength + elongation * animationProgress;

    // Draw the stress-strain visualization
    drawStressStrainVisualization(animationProgress);

    // Draw information
    drawInformation();
  };
  
  function resetAnimation() {
    animationTime = 0;
    animating = true;
  }
  
  function calculateStressStrain() {
    if (area === 0) {
      console.error("Error: Area cannot be zero.");
      return;
    }
    if (youngsModulus === 0) {
      console.error("Error: Young's modulus cannot be zero.");
      return;
    }
    // Calculate stress (force / area)
    // Convert area from mm² to m²
    let areaInSquareMeters = area / 1000000;
    stress = force / areaInSquareMeters / 1000000; // Convert to MPa
    
    // Calculate strain (stress / Young's modulus)
    // Convert Young's modulus from GPa to MPa
    let modulusInMPa = youngsModulus * 1000;
    strain = stress / modulusInMPa;
    
    // Calculate elongation (strain * original length)
    // Scale for visualization
    elongation = strain * originalLength * scaleFactor;
    
    // Update formula display
    updateFormulaDisplay();
    
    // Log values for debugging
    console.log("Stress-Strain Update:", {
      force: force,
      area: area,
      youngsModulus: youngsModulus,
      stress: stress,
      strain: strain,
      elongation: elongation
    });
  }
  
  function drawStressStrainVisualization(animationProgress) {
    let currentElongation = elongation * animationProgress;

    // Draw fixed support
    p.push();
    p.fill(100);
    p.noStroke();
    p.rect(width * 0.1 - 20, height * 0.4 - barHeight, 20, barHeight * 2);
    p.pop();

    // Draw bar
    p.push();
    p.fill(52, 152, 219);
    p.stroke(41, 128, 185);
    p.strokeWeight(2);
    p.rect(width * 0.1, height * 0.4 - barHeight / 2, deformedLength, barHeight, 0, 5, 5, 0);
    p.pop();

    // Draw original length indicator (dashed line)
    p.push();
    p.stroke(150);
    p.strokeWeight(1);
    let dashLength = 5;
    for (let x = width * 0.1; x < width * 0.1 + originalLength; x += dashLength * 2) {
      p.line(x, height * 0.4 + barHeight / 2 + 10, x + dashLength, height * 0.4 + barHeight / 2 + 10);
    }
    p.pop();

    // Draw force arrow
    p.push();
    p.stroke(255, 0, 0);
    p.strokeWeight(3);
    p.fill(255, 0, 0);
    let arrowX = width * 0.1 + deformedLength;
    let arrowY = height * 0.4;
    let arrowLength = 50;
    let arrowSize = 10;
    p.line(arrowX, arrowY, arrowX + arrowLength, arrowY);
    p.triangle(arrowX + arrowLength, arrowY, arrowX + arrowLength - arrowSize, arrowY - arrowSize / 2, arrowX + arrowLength - arrowSize, arrowY + arrowSize / 2);
    p.noStroke();
    p.textSize(16);
    p.textAlign(p.CENTER);
    p.text("F = " + force + " N", arrowX + arrowLength / 2, arrowY - 15);
    p.pop();

    // Draw area indicator
    p.push();
    p.stroke(0);
    p.strokeWeight(1);
    let areaX = width * 0.1 + deformedLength / 2;
    let areaY = height * 0.4 - barHeight / 2;
    let areaHeight = barHeight;
    let dimensionOffset = 20;
    p.line(areaX + dimensionOffset, areaY, areaX + dimensionOffset, areaY + areaHeight);
    p.line(areaX + dimensionOffset - 5, areaY, areaX + dimensionOffset + 5, areaY);
    p.line(areaX + dimensionOffset - 5, areaY + areaHeight, areaX + dimensionOffset + 5, areaY + areaHeight);
    p.noStroke();
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.text("A = " + area + " mm²", areaX + dimensionOffset + 30, areaY + areaHeight / 2);
    p.pop();

    // Draw elongation indicator
    if (elongation > 0) {
      p.push();
      p.stroke(0, 128, 0);
      p.strokeWeight(2);
      p.fill(0, 128, 0);
      p.textSize(14);
      p.textAlign(p.CENTER);
      let deltaX = width * 0.1 + originalLength;
      let deltaY = height * 0.4 + barHeight / 2 + 30;
      p.line(deltaX, deltaY - 5, deltaX, deltaY + 5);
      p.line(deltaX + currentElongation, deltaY - 5, deltaX + currentElongation, deltaY + 5);
      p.line(deltaX, deltaY, deltaX + currentElongation, deltaY);
      p.text("ΔL = " + (currentElongation / scaleFactor).toFixed(3) + " mm", deltaX + currentElongation / 2, deltaY + 15);
      p.pop();
    }
  }
  
  function drawInformation() {
    p.push();
    p.fill(0);
    p.noStroke();
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Stress (σ): " + stress.toFixed(2) + " MPa", 20, 20);
    p.text("Strain (ε): " + strain.toExponential(4), 20, 50);
    p.text("Young's Modulus (E): " + youngsModulus + " GPa", 20, 80);
    p.pop();
  }
  
  function updateFormulaDisplay() {
    let formulaElement = document.getElementById('stress-strain-formula');
    if (!formulaElement) return;

    let areaInSquareMeters = area / 1000000;
    let stressCalculation = force + " \\text{ N} \\div " + areaInSquareMeters.toExponential(2) + " \\text{ m}^2 = " + stress.toFixed(2) + " \\text{ MPa}";
    let strainCalculation = stress.toFixed(2) + " \\text{ MPa} \\div " + (youngsModulus * 1000) + " \\text{ MPa} = " + strain.toExponential(4);

    let formula = `\\sigma = \\frac{F}{A} = ${stressCalculation} \\\\
                   \\varepsilon = \\frac{\\sigma}{E} = ${strainCalculation} \\\\
                   \\Delta L = \\varepsilon \\cdot L_0 = ${strain.toExponential(4)} \\cdot L_0`;

    try {
      katex.render(formula, formulaElement);
    } catch (e) {
      console.error("KaTeX rendering error:", e);
      formulaElement.textContent = "Error rendering formula";
    }
  }
  
  p.windowResized = function() {
    let container = document.getElementById('stress-strain-canvas');
    width = container.offsetWidth;
    height = container.offsetHeight;
    p.resizeCanvas(width, height);

    barWidth = width * 0.6;
    barHeight = height * 0.2;
    originalLength = barWidth;

    calculateStressStrain();
    resetAnimation();
  };
};

// Create the stress-strain sketch instance
new p5(stressStrainSketch);
