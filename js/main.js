//var scroll = new SmoothScroll('a[href*="#"]', 800);
//const panel = document.getElementById('panel');

panel.addEventListener('mousemove', function(event) {
    // Get mouse coordinates relative to the panel
    const x = event.clientX - panel.getBoundingClientRect().left;
    const y = event.clientY - panel.getBoundingClientRect().top;

    // Update panel content based on mouse position
    panel.innerHTML = `Mouse coordinates: (${x}, ${y})`;
});