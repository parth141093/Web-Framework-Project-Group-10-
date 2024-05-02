document.addEventListener("DOMContentLoaded", function() {
    //rating system
    const ratingForm = document.getElementById('rating-form');
    if (ratingForm) {
        ratingForm.onsubmit = async function(e) {
            e.preventDefault();
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json',
                    'api-key': 'handsome'
                }
            });

            const result = await response.json();
            if (result.success) {
                alert('Thank you for your rating!');
                window.location.reload();
            } else {
                alert('Failed to submit rating');
            }
        };
    }

    //backtotop btn
    window.onscroll = function() {
        var backToTopBtn = document.getElementById("backToTopBtn");
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    };

    //dark/light btn
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (localStorage.getItem('dark-theme') === 'true') {
        body.classList.add('dark-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = body.classList.toggle('dark-theme');
            localStorage.setItem('dark-theme', isDark);
        });
    }
});
