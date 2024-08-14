document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews');
    const reviewForm = document.getElementById('review-form');
    const showFormButton = document.getElementById('show-form-button');
    let selectedRating = 0;

    
    // Navigation Bar
    const menubar = document.getElementById('menubar');
    const navLinks = document.querySelector('.nav-links');

    menubar.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        menubar.classList.toggle('toggle');
    });
    
    function fetchReviews() {
        fetch('http://localhost:3000/reviews')
            .then(response => response.json())
            .then(reviews => {
                reviewsContainer.innerHTML = '';
                reviews.forEach(review => {
                    const reviewDiv = document.createElement('div');
                    reviewDiv.className = 'review';

                    const nameElement = document.createElement('div');
                    nameElement.className = 'name';
                    nameElement.textContent = review.name;

                    const textElement = document.createElement('div');
                    textElement.className = 'text';
                    textElement.textContent = review.review;

                    const ratingElement = document.createElement('div');
                    ratingElement.className = 'rating';
                    ratingElement.innerHTML = 'Rating: ' + '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

                    reviewDiv.appendChild(nameElement);
                    reviewDiv.appendChild(textElement);
                    reviewDiv.appendChild(ratingElement);
                    reviewsContainer.appendChild(reviewDiv);
                });
            });
    }

    function toggleForm() {
        if (reviewForm.style.display === 'none') {
            reviewForm.style.display = 'block';
            showFormButton.textContent = 'Cancel';
        } else {
            reviewForm.style.display = 'none';
            showFormButton.textContent = 'Add Review';
        }
    }

    function addReview() {
        const nameInput = document.getElementById('name-input');
        const reviewInput = document.getElementById('review-input');
        const name = nameInput.value.trim();
        const reviewText = reviewInput.value.trim();

        if (name !== '' && reviewText !== '' && selectedRating > 0) {
            fetch('http://localhost:3000/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    review: reviewText,
                    rating: selectedRating
                })
            })
            .then(response => response.text())
            .then(() => {
                fetchReviews();
                nameInput.value = '';
                reviewInput.value = '';
                selectedRating = 0;
                clearStars();
                toggleForm();
            });
        } else {
            alert('Please enter your name, review, and select a rating.');
        }
    }

    function clearStars() {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => star.classList.remove('selected'));
    }

    function selectStar(event) {
        const star = event.currentTarget;
        const value = parseInt(star.getAttribute('data-value'));
        selectedRating = value;
        clearStars();
        star.classList.add('selected');
        let previousSibling = star.previousElementSibling;
        while (previousSibling) {
            previousSibling.classList.add('selected');
            previousSibling = previousSibling.previousElementSibling;
        }
    }

    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', selectStar);
    });

    window.toggleForm = toggleForm;
    window.addReview = addReview;

    // Load reviews on page load
    fetchReviews();
});
