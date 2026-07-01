
let allMovies = [];

const moviesGrid = document.getElementById("movies-grid");
const searchForm = document.getElementById("search_form");
const favoritesGrid = document.getElementById("favorites-grid");
const clearFavsBtn = document.getElementById("clear-favs");

// ოპტიმიზაცია: ფუნქცია აბრუნებს HTML სტრინგს და პირდაპირ არ ცვლის innerHTML-ს
const createMovieCard = (movie, isFavoritePage = false) => {
    const buttonHtml = isFavoritePage 
        ? `<button class="clear-btn" onclick="removeSingleFav(${movie.id})">წაშლა</button>`
        : `<button class="fav-btn" onclick="addToFavorites(${movie.id})">ფავორიტი</button>`;

    return `
        <div class="movie-card">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <div>
                    <h4>${movie.title}</h4>
                    <p>ჟანრი: ${movie.genre}</p>
                    <p>წელი: ${movie.year}</p>
                </div>
                ${buttonHtml}
            </div>
        </div>
    `;
};

const renderMovies = (moviesArray) => {
    if (!moviesGrid) return;
    moviesGrid.innerHTML = "";

    if (moviesArray.length === 0) {
        moviesGrid.innerHTML = "<p>ფილმი ვერ მოიძებნა...</p>";
        return;
    }

    // ოპტიმიზაცია: HTML-ის ერთიანად ჩასმა
    let moviesHTML = "";
    moviesArray.forEach(movie => {
        moviesHTML += createMovieCard(movie, false);
    });
    moviesGrid.innerHTML = moviesHTML;
};

const handleSearch = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const searchTerm = data.search ? data.search.toLowerCase() : "";

    const filteredMovies = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm)
    );

    renderMovies(filteredMovies);
};

window.addToFavorites = (movieId) => {
    const savedFavs = localStorage.getItem("favoriteMovies");
    let favorites = savedFavs ? JSON.parse(savedFavs) : [];

    if (!favorites.includes(movieId)) {
        favorites.push(movieId);
        localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
        alert("ფილმი დაემატა ფავორიტებში!");
    } else {
        alert("ეს ფილმი უკვე ფავორიტებშია!");
    }
};

const renderFavorites = () => {
    if (!favoritesGrid) return; 

    const savedFavs = localStorage.getItem("favoriteMovies");
    const favoriteIds = savedFavs ? JSON.parse(savedFavs) : [];

    favoritesGrid.innerHTML = "";

    // დაცვა: თუ json-იდან მონაცემები ჯერ არ ჩატვირთულა, არაფერი გააკეთოს
    if (allMovies.length === 0 && favoriteIds.length > 0) return;

    const favoriteMovies = allMovies.filter(movie => favoriteIds.includes(movie.id));

    if (favoriteMovies.length === 0) {
        favoritesGrid.innerHTML = "<p style='grid-column: 1/-1;'>თქვენი ფავორიტების სია ცარიელია.</p>";
        if (clearFavsBtn) clearFavsBtn.style.display = "none";
        return;
    }

    if (clearFavsBtn) clearFavsBtn.style.display = "block";

    // ოპტიმიზაცია: HTML-ის ერთიანად ჩასმა
    let favsHTML = "";
    favoriteMovies.forEach(movie => {
        favsHTML += createMovieCard(movie, true);
    });
    favoritesGrid.innerHTML = favsHTML;
};

window.removeSingleFav = (movieId) => {
    const savedFavs = localStorage.getItem("favoriteMovies");
    let favorites = savedFavs ? JSON.parse(savedFavs) : [];

    favorites = favorites.filter(id => id !== movieId);
    localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
    renderFavorites(); 
};

if (clearFavsBtn) {
    clearFavsBtn.addEventListener("click", () => {
        if (confirm("ნამდვილად გსურთ ყველა ფავორიტის წაშლა?")) {
            localStorage.removeItem("favoriteMovies");
            renderFavorites();
        }
    });
}

const loadMovies = async () => {
    try {
        const response = await fetch("movies.json");
        if (!response.ok) throw new Error("შეცდომაა ფაილის წაკითხვისას!");
        
        allMovies = await response.json();

        if (moviesGrid) {
            renderMovies(allMovies);
        }
        if (favoritesGrid) {
            renderFavorites();
        }
    } catch (error) {
        console.error(error);
        if (moviesGrid) moviesGrid.innerHTML = "<p style='color: red;'>ფილმების ჩატვირთვა ვერ მოხერხდა.</p>";
    }
};

// ფორმის ვალიდაცია (დარჩა უცვლელი, მუშაობს გამართულად)
const requestForm = document.getElementById('request-form');
if (requestForm) {
    requestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const movieTitle = document.getElementById('movie-title').value.trim();
        
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const titleError = document.getElementById('title-error');
        const successMessage = document.getElementById('success-message');
        
        nameError.textContent = '';
        emailError.textContent = '';
        titleError.textContent = '';
        successMessage.style.display = 'none';
        
        let isValid = true;
        
        if (username.length < 3) {
            nameError.textContent = 'სახელი უნდა შედგებოდეს მინიმუმ 3 სიმბოლოსგან!';
            isValid = false;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            emailError.textContent = 'გთხოვთ, მიუთითოთ სწორი ელ-ფოსტა!';
            isValid = false;
        }
        
        if (movieTitle === '') {
            titleError.textContent = 'ფილმის დასახელების მითითება აუცილებელია!';
            isValid = false;
        }
        
        if (isValid) {
            successMessage.textContent = `გმადლობთ ${username}, მოთხოვნა ფილმზე "${movieTitle}" წარმატებით გაიგზავნა!`;
            successMessage.style.display = 'block';
            requestForm.reset();
        }
    });
}

if (searchForm) {
    searchForm.addEventListener("submit", handleSearch);
}
document.addEventListener("DOMContentLoaded", loadMovies);