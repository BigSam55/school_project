document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired.");
    const loader = document.querySelector('.loader');

    // Show loader
    loader.style.display = 'block';
    
    console.log("Loader shown.");

    setTimeout(() => {
        console.log("2 seconds passed.");
        // Assuming that `next()` is a function that returns the URL to redirect to
        window.location.href = ('/login'); // Redirect after delay
    }, 2000);
});
