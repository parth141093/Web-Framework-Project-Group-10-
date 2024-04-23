document.addEventListener("DOMContentLoaded", function() {
    const ratingForm = document.getElementById('rating-form');
    if (ratingForm) {
        ratingForm.onsubmit = async function(e) {
            e.preventDefault();
            const form = e.target;
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
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
});

function backToTop() {
    document.body.scrollTop = 0; // safari
    document.documentElement.scrollTop = 0; 
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    var backToTopBtn = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}
