const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files - improved for Vercel deployment
app.use(express.static(__dirname));

// Sample data - event planners
const eventPlanners = [
    // Faridabad planners
    {
        id: 1,
        name: 'Dreamz Wedding Planner',
        profile: 'Wedding Planner',
        contact_number: '9958970749',
        budget_range: '50000-200000',
        location: 'Faridabad'
    },
    {
        id: 2,
        name: 'Blue Dolphin Events',
        profile: 'Birthday Planner',
        contact_number: '9871214666',
        budget_range: '20000-80000',
        location: 'Faridabad'
    },
    {
        id: 3,
        name: 'Innovative Event Management',
        profile: 'Corporate Event Planner',
        contact_number: '9910559403',
        budget_range: '80000-300000',
        location: 'Faridabad'
    },
    {
        id: 4,
        name: 'Elite Weddings India',
        profile: 'Wedding Planner',
        contact_number: '9871440402',
        budget_range: '100000-400000',
        location: 'Faridabad'
    },
    {
        id: 5,
        name: 'Celebrations Event',
        profile: 'Birthday Planner',
        contact_number: '9990408490',
        budget_range: '15000-60000',
        location: 'Faridabad'
    },
    // Delhi planners
    {
        id: 6,
        name: 'Delhi Wedding Company',
        profile: 'Wedding Planner',
        contact_number: '9811065221',
        budget_range: '100000-500000',
        location: 'Delhi'
    },
    {
        id: 7,
        name: 'Delhi Party Makers',
        profile: 'Birthday Planner',
        contact_number: '9910903300',
        budget_range: '30000-120000',
        location: 'Delhi'
    },
    {
        id: 8,
        name: 'Delhi Corporate Events',
        profile: 'Corporate Event Planner',
        contact_number: '9947676361',
        budget_range: '120000-450000',
        location: 'Delhi'
    },
    // Gurgaon planners
    {
        id: 9,
        name: 'Gurgaon Wedding Planners',
        profile: 'Wedding Planner',
        contact_number: '9587900200',
        budget_range: '80000-300000',
        location: 'Gurgaon'
    },
    {
        id: 10,
        name: 'Happy Birthday Gurgaon',
        profile: 'Birthday Planner',
        contact_number: '9876543210',
        budget_range: '25000-100000',
        location: 'Gurgaon'
    },
    // Noida planners
    {
        id: 11,
        name: 'Noida Weddings',
        profile: 'Wedding Planner',
        contact_number: '9911234567',
        budget_range: '70000-250000',
        location: 'Noida'
    },
    {
        id: 12,
        name: 'Party Planet Noida',
        profile: 'Birthday Planner',
        contact_number: '9922345678',
        budget_range: '20000-80000',
        location: 'Noida'
    },
    // Mumbai planners
    {
        id: 13,
        name: 'Mumbai Wedding Dreams',
        profile: 'Wedding Planner',
        contact_number: '9933456789',
        budget_range: '150000-600000',
        location: 'Mumbai'
    },
    {
        id: 14,
        name: 'Corporate Mumbai',
        profile: 'Corporate Event Planner',
        contact_number: '9944567890',
        budget_range: '200000-800000',
        location: 'Mumbai'
    },
    // Bangalore planners
    {
        id: 15,
        name: 'Bangalore Weddings',
        profile: 'Wedding Planner',
        contact_number: '9955678901',
        budget_range: '100000-400000',
        location: 'Bangalore'
    },
    {
        id: 16,
        name: 'Bangalore Tech Events',
        profile: 'Corporate Event Planner',
        contact_number: '9966789012',
        budget_range: '150000-600000',
        location: 'Bangalore'
    },
    // Additional social gatherings planners for all locations
    {
        id: 17,
        name: 'Social Connect Delhi',
        profile: 'Social Gatherings',
        contact_number: '9977890123',
        budget_range: '30000-120000',
        location: 'Delhi'
    },
    {
        id: 18,
        name: 'Faridabad Social Events',
        profile: 'Social Gatherings',
        contact_number: '9988901234',
        budget_range: '25000-100000',
        location: 'Faridabad'
    },
    {
        id: 19,
        name: 'Mumbai Social Club',
        profile: 'Social Gatherings',
        contact_number: '9999012345',
        budget_range: '50000-200000',
        location: 'Mumbai'
    },
    {
        id: 20,
        name: 'Bangalore Gathering Experts',
        profile: 'Social Gatherings',
        contact_number: '8800123456',
        budget_range: '40000-160000',
        location: 'Bangalore'
    }
];

// Sample data - event types
const eventTypes = [
    { id: 1, name: 'Wedding Planner' },
    { id: 2, name: 'Birthday Planner' },
    { id: 3, name: 'Corporate Event Planner' },
    { id: 4, name: 'Social Gatherings' }
];

// API Routes
app.get('/api/event-types', (req, res) => {
    res.json(eventTypes);
});

app.get('/api/locations', (req, res) => {
    // Extract unique locations from the event planners data
    const locations = [...new Set(eventPlanners.map(planner => planner.location))];
    const locationObjects = locations.map((location, index) => ({
        id: index + 1,
        name: location
    }));
    res.json(locationObjects);
});

app.get('/api/event-planners', (req, res) => {
    res.json(eventPlanners);
});

app.get('/api/search-planners', (req, res) => {
    const { event_type, location } = req.query;
    
    let filteredPlanners = [...eventPlanners];
    
    // Filter by location if provided
    if (location) {
        filteredPlanners = filteredPlanners.filter(planner => 
            planner.location.toLowerCase() === location.toLowerCase()
        );
    }
    
    // Filter by event type if provided
    if (event_type) {
        filteredPlanners = filteredPlanners.filter(planner => 
            planner.profile.includes(event_type)
        );
    }
    
    res.json(filteredPlanners);
});

// Fallback route for serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index3.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 
