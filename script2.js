document.addEventListener('DOMContentLoaded', function() {
  // Load event types for dropdown
  loadEventTypes();
  
  // Load default planners when page loads
  loadDefaultPlanners();
  
  // Set up form submission handler
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
  }
});

async function loadEventTypes() {
  try {
    const response = await fetch('/api/event-types');
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
  }
}

async function loadDefaultPlanners() {
  try {
    // Load all planners with default location
    const response = await fetch('/api/event-planners');
    if (!response.ok) {
      throw new Error('Failed to fetch planners');
    }
    
    const planners = await response.json();
    displayResults(planners);
  } catch (error) {
    console.error('Error loading planners:', error);
  }
}

async function handleSearch(event) {
  event.preventDefault();
  
  const eventType = document.getElementById('event-type').value;
  const budget = document.getElementById('budget').value;
  
  try {
    // Default location is Faridabad
    const response = await fetch(`/api/search-planners?event_type=${eventType}&location=Faridabad`);
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    
    const planners = await response.json();
    
    // Redirect to search results section
    const searchResultsSection = document.getElementById('search-results-section');
    if (searchResultsSection) {
      searchResultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    displayResults(planners);
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
