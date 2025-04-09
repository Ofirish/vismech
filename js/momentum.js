// Momentum simulation using matter.js
let momentumSketch = function(p) {
  // Physics engine variables
  let engine;
  let world;
  let render;
  
  // Objects
  let ball;
  let wall;
  
  // Parameters
  let mass = 2;
  let velocity = 5;
  let restitution = 0.8;
  
  // Canvas dimensions
  let width = 0;
  let height = 0;
  
  // Scale factor for visualization
  let scale = 10;
  
  p.setup = function() {
    // Create canvas that fills the container
    let container = document.getElementById('momentum-canvas');
    width = container.offsetWidth;
    height = container.offsetHeight;
    let canvas = p.createCanvas(width, height);
    canvas.parent('momentum-canvas');
    
    // Set up matter.js engine
    engine = Matter.Engine.create();
    world = engine.world;
    
    // Disable gravity in x direction, reduce in y direction for better visualization
    world.gravity.x = 0;
    world.gravity.y = 0.2;
    
    // Create objects
    createObjects();
    
    // Set up event listeners for sliders
    document.getElementById('momentum-mass').addEventListener('input', function() {
      let input = parseFloat(this.value);
      if (isNaN(input) || input <= 0) {
        console.error("Invalid mass value.");
        return;
      }
      mass = input;
      document.getElementById('momentum-mass-value').textContent = mass + ' kg';
      updateBall();
    });
    
    document.getElementById('momentum-velocity').addEventListener('input', function() {
      let input = parseFloat(this.value);
      if (isNaN(input)) {
        console.error("Invalid velocity value.");
        return;
      }
      velocity = input;
      document.getElementById('momentum-velocity-value').textContent = velocity + ' m/s';
      updateBall();
    });
    
    document.getElementById('momentum-restitution').addEventListener('input', function() {
      restitution = parseFloat(this.value);
      document.getElementById('momentum-restitution-value').textContent = restitution.toFixed(2);
      updateBall();
    });
    
    document.getElementById('momentum-reset').addEventListener('click', function() {
      resetSimulation();
    });
    
    // Update formula display
    updateFormulaDisplay();
  };
  
  p.draw = function() {
    p.background(249, 249, 249);
    
    // Update physics engine
    Matter.Engine.update(engine);
    
    // Draw objects
    drawObjects();
    
    // Draw information
    drawInfo();
  };
  
  function createObjects() {
    // Create ball
    let radius = 20 + mass * 5; // Radius based on mass
    ball = Matter.Bodies.circle(width * 0.25, height / 2, radius, {
      restitution: restitution,
      friction: 0.005,
      frictionAir: 0.001,
      render: {
        fillStyle: '#3498db'
      }
    });
    
    // Set initial velocity
    Matter.Body.setVelocity(ball, { x: velocity, y: 0 });
    
    // Create walls
    let wallThickness = 50;
    let leftWall = Matter.Bodies.rectangle(0, height / 2, wallThickness, height, { isStatic: true });
    let rightWall = Matter.Bodies.rectangle(width, height / 2, wallThickness, height, { isStatic: true });
    let topWall = Matter.Bodies.rectangle(width / 2, 0, width, wallThickness, { isStatic: true });
    let bottomWall = Matter.Bodies.rectangle(width / 2, height, width, wallThickness, { isStatic: true });
    
    // Add all objects to the world
    Matter.Composite.add(world, [ball, leftWall, rightWall, topWall, bottomWall]);
    
    // Add collision event listener
    Matter.Events.on(engine, 'collisionStart', function(event) {
      let pairs = event.pairs;
      
      for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        if (pair.bodyA === ball || pair.bodyB === ball) {
          // Update formula display after collision
          updateFormulaDisplay();
        }
      }
    });
  }
  
  function updateBall() {
    // Remove old ball
    Matter.Composite.remove(world, ball);
    
    // Create new ball with updated properties
    let radius = 20 + mass * 5; // Radius based on mass
    ball = Matter.Bodies.circle(width * 0.25, height / 2, radius, {
      restitution: restitution,
      friction: 0.005,
      frictionAir: 0.001,
      render: {
        fillStyle: '#3498db'
      }
    });
    
    // Set initial velocity
    Matter.Body.setVelocity(ball, { x: velocity, y: 0 });
    
    // Add to world
    Matter.Composite.add(world, ball);
    
    // Update formula display
    updateFormulaDisplay();
  }
  
  function resetSimulation() {
    // Remove all objects
    Matter.Composite.clear(world);
    
    // Recreate objects
    createObjects();
  }
  
  function drawObjects() {
    // Draw ball
    p.push();
    p.fill(52, 152, 219);
    p.noStroke();
    p.ellipse(ball.position.x, ball.position.y, ball.circleRadius * 2);
    p.pop();
    
    // Draw velocity vector
    let speed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
    let angle = Math.atan2(ball.velocity.y, ball.velocity.x);
    
    p.push();
    p.stroke(255, 0, 0);
    p.strokeWeight(2);
    p.fill(255, 0, 0);
    
    // Draw line
    let vectorLength = speed * 10;
    let x1 = ball.position.x;
    let y1 = ball.position.y;
    let x2 = x1 + Math.cos(angle) * vectorLength;
    let y2 = y1 + Math.sin(angle) * vectorLength;
    p.line(x1, y1, x2, y2);
    
    // Draw arrowhead
    let arrowSize = 10;
    p.translate(x2, y2);
    p.rotate(angle);
    p.triangle(0, 0, -arrowSize, arrowSize/2, -arrowSize, -arrowSize/2);
    p.pop();
    
    // Draw walls
    p.push();
    p.fill(200);
    p.noStroke();
    p.rect(0, 0, 25, height); // Left wall
    p.rect(width - 25, 0, 25, height); // Right wall
    p.rect(0, 0, width, 25); // Top wall
    p.rect(0, height - 25, width, 25); // Bottom wall
    p.pop();
  }
  
  function drawInfo() {
    // Calculate current momentum
    let currentVelocity = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
    let momentum = mass * currentVelocity;
    
    // Draw information text
    p.push();
    p.fill(0);
    p.noStroke();
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Current velocity: " + currentVelocity.toFixed(2) + " m/s", 30, 30);
    p.text("Current momentum: " + momentum.toFixed(2) + " kg·m/s", 30, 60);
    p.pop();
  }
  
  function updateFormulaDisplay() {
    // Calculate current momentum
    let currentVelocity = ball ? Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y) : velocity;
    let momentum = mass * currentVelocity;
    
    // Update formula display using KaTeX
    let formulaElement = document.getElementById('momentum-formula');
    let formula = `p = m \\cdot v = ${mass.toFixed(1)} \\text{ kg} \\cdot ${currentVelocity.toFixed(2)} \\text{ m/s} = ${momentum.toFixed(2)} \\text{ kg}\\cdot\\text{m/s}`;
    
    katex.render(formula, formulaElement);
  }
  
  // Handle window resize
  p.windowResized = function() {
    let container = document.getElementById('momentum-canvas');
    width = container.offsetWidth;
    height = container.offsetHeight;
    p.resizeCanvas(width, height);
    
    // Reset simulation to fit new dimensions
    resetSimulation();
  };
};

// Create the momentum sketch instance
new p5(momentumSketch);
