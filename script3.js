document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  checkUserLoginStatus();
  
  // Load event types for dropdown
  loadEventTypes();
  
  // Load default planners when page loads
  loadDefaultPlanners();
  
  // Set up form submission handler
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
  }

  // Set up contact form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = contactForm.querySelector('input[type="text"]').value;
      alert(`Thank you, ${name}! Your message has been sent. We'll get back to you soon.`);
      contactForm.reset();
    });
  }

  // Set up smooth scrolling for all links with class "smooth-scroll"
  document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Handle location change
  const locationSelect = document.getElementById('location');
  if (locationSelect) {
    locationSelect.addEventListener('change', function() {
      const selectedLocation = document.getElementById('selected-location');
      if (selectedLocation) {
        selectedLocation.textContent = this.value;
      }
    });
  }
});

// Function to check if user is logged in
function checkUserLoginStatus() {
  // Check for user data in localStorage
  const userData = localStorage.getItem('userData');
  
  if (userData) {
    // User is logged in, hide signin/signup buttons
    const authButtons = document.querySelectorAll('.auth-btn');
    authButtons.forEach(button => {
      button.parentElement.style.display = 'none';
    });
    
    // Add logout button if it doesn't exist yet
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !document.querySelector('.logout-btn')) {
      const logoutItem = document.createElement('li');
      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.textContent = 'Logout';
      logoutLink.className = 'logout-btn';
      logoutLink.style.backgroundColor = '#dc3545';
      logoutLink.style.color = 'white';
      logoutLink.style.padding = '8px 15px';
      logoutLink.style.borderRadius = '5px';
      logoutLink.style.textDecoration = 'none';
      
      logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        // Clear user data from localStorage
        localStorage.removeItem('userData');
        // Reload the page to show login buttons again
        window.location.reload();
      });
      
      logoutItem.appendChild(logoutLink);
      navLinks.appendChild(logoutItem);
    }
  }
}

async function loadEventTypes() {
  try {
    const response = await fetch('http://localhost:3000/api/event-types');
    if (!response.ok) {
      throw new Error('Failed to fetch event types');
    }
    
    const eventTypes = await response.json();
    const eventTypeSelect = document.getElementById('event-type');
    
    if (eventTypeSelect) {
      eventTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.name;
        option.textContent = type.name;
        eventTypeSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error loading event types:', error);
    // Mock data if API fails
    const mockEventTypes = [
      { id: 1, name: 'Wedding Planner' },
      { id: 2, name: 'Birthday Planner' },
      { id: 3, name: 'Corporate Event Planner' },
      { id: 4, name: 'Social Gatherings' }
    ];
    
    const eventTypeSelect = document.getElementById('event-type');
    
    if (eventTypeSelect) {
      mockEventTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.name;
        option.textContent = type.name;
        eventTypeSelect.appendChild(option);
      });
    }
  }
}

async function loadDefaultPlanners() {
  try {
    // Load all planners with default location
    const response = await fetch('http://localhost:3000/api/event-planners');
    if (!response.ok) {
      throw new Error('Failed to fetch planners');
    }
    
    const planners = await response.json();
    displayResults(planners);
  } catch (error) {
    console.error('Error loading planners:', error);
    // Use mock data if API fails
    const mockPlanners = [
      {
        name: 'Dreamz Wedding Planner',
        profile: 'Wedding Planner',
        contact_number: '9958970749',
        budget_range: '50000-200000',
        location: 'Faridabad'
      },
      {
        name: 'Blue Dolphin Events',
        profile: 'Birthday Planner',
        contact_number: '9871214666',
        budget_range: '20000-80000',
        location: 'Faridabad'
      },
      {
        name: 'Innovative Event Management',
        profile: 'Corporate Event Planner',
        contact_number: '9910559403',
        budget_range: '80000-300000',
        location: 'Faridabad'
      }
    ];
    
    displayResults(mockPlanners);
  }
}

async function handleSearch(event) {
  event.preventDefault();
  
  const eventType = document.getElementById('event-type').value;
  const location = document.getElementById('location').value || 'Faridabad';
  const budget = document.getElementById('budget').value;
  
  try {
    const response = await fetch(`http://localhost:3000/api/search-planners?event_type=${eventType}&location=${location}`);
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    
    const planners = await response.json();
    
    // Update the location title
    const selectedLocation = document.getElementById('selected-location');
    if (selectedLocation) {
      selectedLocation.textContent = location;
    }
    
    // Filter by budget only if provided
    let filteredPlanners = planners;
    if (budget && budget !== '') {
      filteredPlanners = planners.filter(planner => {
        const [minBudget, maxBudget] = planner.budget_range.split('-').map(Number);
        return budget >= minBudget && budget <= maxBudget;
      });
    }
    
    // Redirect to search results section
    const searchResultsSection = document.getElementById('search-results-section');
    if (searchResultsSection) {
      searchResultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    displayResults(filteredPlanners);
  } catch (error) {
    console.error('Error searching planners:', error);
    displayError('An error occurred while searching for planners. Please try again.');
  }
}

function displayResults(planners) {
  const resultsContainer = document.getElementById('search-results');
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = '';
  
  if (planners.length === 0) {
    resultsContainer.innerHTML = '<p class="no-results">No event planners found matching your criteria.</p>';
    return;
  }
  
  planners.forEach(planner => {
    const card = document.createElement('div');
    card.className = 'contractor-card';
    
    // Generate random rating between 3.5 and 5.0
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    const stars = Math.floor(rating);
    const starHtml = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    
    // Extract budget range values
    const budgetRange = planner.budget_range || '10000-50000';
    const [minBudget, maxBudget] = budgetRange.split('-').map(val => parseInt(val));
    
    card.innerHTML = `
      <h3>${planner.name}</h3>
      <div class="contractor-info">
        <p><strong>Type:</strong> ${planner.profile}</p>
        <p><strong>Location:</strong> ${planner.location}</p>
        <p><strong>Rating:</strong> <span class="rating">${starHtml}</span> (${rating})</p>
        <p><strong>Budget Range:</strong> ₹${minBudget.toLocaleString()} - ₹${maxBudget.toLocaleString()}</p>
      </div>
      <div class="contractor-contact">
        <p><strong>Contact:</strong> <a href="tel:${planner.contact_number}">${planner.contact_number}</a></p>
      </div>
      <button class="contact-btn" onclick="contactPlanner('${planner.contact_number}')">Contact Now</button>
    `;
    
    resultsContainer.appendChild(card);
  });
}

function contactPlanner(phoneNumber) {
  window.location.href = `tel:${phoneNumber}`;
}

function displayError(message) {
  const resultsContainer = document.getElementById('search-results');
  if (resultsContainer) {
    resultsContainer.innerHTML = `<p class="error">${message}</p>`;
  }
} 