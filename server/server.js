const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Load the sites to monitor
const sites = require('../public/js/sites');

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Function to check the status of each site
const checkSites = async () => {
    for (const site of sites) {
        try {
            const response = await axios.get(site.url);
            if (response.status === 200) {
                io.emit('siteStatusUpdate', { name: site.name, url: site.url, status: 'up', uptime: '100', responseTime: '120ms' });
            }
        } catch (error) {
            io.emit('siteStatusUpdate', { name: site.name, url: site.url, status: 'down', uptime: '0', responseTime: 'N/A' });
        }
    }
};

// Check the sites every 30 seconds
setInterval(checkSites, 30000);
checkSites(); // Initial check

// Start the server using the port from .env or default to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on localhost:${PORT}`);
});
