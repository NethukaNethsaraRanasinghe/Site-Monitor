const socket = io();

const siteList = document.getElementById('siteList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalChart = document.getElementById('modalChart').getContext('2d');
let chart;

// Listen for site status updates
socket.on('siteStatusUpdate', (data) => {
    updateSiteStatusCard(data.url, data.status);
});

function updateSiteStatusCard(url, status) {
    let card = document.getElementById(url);
    const colorClass = status === 'up' ? 'up' : 'down';

    if (!card) {
        card = document.createElement('div');
        card.className = 'site-card';
        card.id = url;
        card.innerHTML = `
            <div class="status-indicator ${colorClass}"></div>
            <strong>${url}</strong><br>
            Overall Uptime: <span id="${url}-uptime">${status === 'up' ? '100' : '0'}%</span>
        `;
        card.onclick = () => showModal(url);
        siteList.appendChild(card);
    } else {
        const uptimeElement = document.getElementById(`${url}-uptime`);
        uptimeElement.innerText = status === 'up' ? '100%' : '0%';
    }
}

function showModal(url) {
    modalTitle.innerText = url;
    modal.style.display = 'block';
    // Additional modal functionality can be added here
}

function closeModal() {
    modal.style.display = 'none';
}
