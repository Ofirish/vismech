// Updated main JavaScript file with direct value input for sliders
document.addEventListener('DOMContentLoaded', function() {
  // Initialize KaTeX rendering for all formula displays
  const formulaElements = document.querySelectorAll('.formula-display');
  formulaElements.forEach(element => {
    katex.render('\\text{Loading formulas...}', element);
  });

  // Set up direct value input for all sliders
  setupDirectValueInput();

  // Highlight active section in navigation menu
  setupNavigationHighlight();

  // Add smooth scrolling for navigation links
  setupSmoothScrolling();

  // Function to update all slider value displays
  function updateSliderValueDisplays() {
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
      const valueDisplay = document.getElementById(slider.id + '-value');
      if (valueDisplay) {
        let value = slider.value;
        
        // Add units based on slider ID
        if (slider.id.includes('mass')) {
          value += ' kg';
        } else if (slider.id.includes('velocity')) {
          value += ' m/s';
        } else if (slider.id.includes('angle') || slider.id.includes('theta')) {
          value += '°';
        } else if (slider.id.includes('force') && !slider.id.includes('stress')) {
          value += ' N';
        } else if (slider.id.includes('stress-force')) {
          value += ' N';
        } else if (slider.id.includes('area')) {
          value += ' mm²';
        } else if (slider.id.includes('modulus')) {
          value += ' GPa';
        }
        
        valueDisplay.textContent = value;
      }
    });
  }

  // Initialize slider value displays
  updateSliderValueDisplays();

  // Set up direct value input for sliders
  function setupDirectValueInput() {
    const sliderValues = document.querySelectorAll('.slider-value');
    
    sliderValues.forEach(valueDisplay => {
      // Add click event to each value display
      valueDisplay.addEventListener('click', function() {
        const sliderId = this.id.replace('-value', '');
        const slider = document.getElementById(sliderId);
        
        if (!slider) return;
        
        // Get current value without units
        let currentValue = this.textContent;
        let numericValue = parseFloat(currentValue);
        
        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'value-input';
        input.value = numericValue;
        
        // Replace value display with input
        this.style.display = 'none';
        this.parentNode.insertBefore(input, this.nextSibling);
        input.focus();
        input.select();
        
        // Handle input blur (when user clicks away)
        input.addEventListener('blur', function() {
          finishEditing(this, slider, valueDisplay);
        });
        
        // Handle Enter key
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            finishEditing(this, slider, valueDisplay);
          }
        });
      });
    });
    
    function finishEditing(input, slider, valueDisplay) {
      let newValue = parseFloat(input.value);
      
      // Validate input is a number and within slider range
      if (!isNaN(newValue)) {
        newValue = Math.min(Math.max(newValue, parseFloat(slider.min)), parseFloat(slider.max));
        
        // Update slider value
        slider.value = newValue;
        
        // Trigger change event on slider to update visualizations
        const event = new Event('input', { bubbles: true });
        slider.dispatchEvent(event);
      }
      
      // Remove input element
      input.remove();
      valueDisplay.style.display = '';
    }
  }

  // Set up navigation menu highlighting
  function setupNavigationHighlight() {
    const sections = document.querySelectorAll('.visualization-section');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Highlight active section on scroll
    window.addEventListener('scroll', function() {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) {
          item.classList.add('active');
        }
      });
    });
  }

  // Set up smooth scrolling for navigation links
  function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 20,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Add event listeners for responsive design
  window.addEventListener('resize', function() {
    // The p5 sketches handle resize events internally
  });

  // Function to check if all visualizations are loaded
  function checkAllVisualizationsLoaded() {
    // This is a placeholder - the p5 sketches initialize independently
    console.log('All visualizations loaded and ready');
  }

  // Call the check function after a short delay to ensure all scripts have loaded
  setTimeout(checkAllVisualizationsLoaded, 1000);
});
