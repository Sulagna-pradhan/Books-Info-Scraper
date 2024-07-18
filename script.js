document.addEventListener('DOMContentLoaded', () => {
    const booksContainer = document.getElementById('books-container');
    const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const loading = document.getElementById('loading');
    const bookModal = document.getElementById('book-modal');
    const modalBookInfo = document.getElementById('modal-book-info');
    const closeButton = document.getElementsByClassName('close-button')[0];

    const fetchBooks = async (query = 'marvel') => {
        try {
            showLoading();
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
            const data = await response.json();
            displayBooks(data.items);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            hideLoading();
        }
    };

    const displayBooks = (books) => {
        booksContainer.innerHTML = '';
        books.forEach(book => {
            const bookInfo = book.volumeInfo;
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <img src="${bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x194?text=No+Image'}" alt="${bookInfo.title}">
                <h2>${bookInfo.title}</h2>
                <p>${bookInfo.authors ? bookInfo.authors.join(', ') : 'No authors available'}</p>
            `;
            bookCard.addEventListener('click', () => showBookModal(bookInfo));
            booksContainer.appendChild(bookCard);
        });
    };

    const showBookModal = (bookInfo) => {
        modalBookInfo.innerHTML = `
            <img src="${bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x194?text=No+Image'}" alt="${bookInfo.title}">
            <h2>${bookInfo.title}</h2>
            <p><strong>Authors:</strong> ${bookInfo.authors ? bookInfo.authors.join(', ') : 'No authors available'}</p>
            <p><strong>Publisher:</strong> ${bookInfo.publisher || 'No publisher available'}</p>
            <p><strong>Published Date:</strong> ${bookInfo.publishedDate || 'No published date available'}</p>
            <p><strong>Description:</strong> ${bookInfo.description || 'No description available'}</p>
            <p><strong>Page Count:</strong> ${bookInfo.pageCount || 'No page count available'}</p>
            <p><strong>Categories:</strong> ${bookInfo.categories ? bookInfo.categories.join(', ') : 'No categories available'}</p>
            <p><strong>Language:</strong> ${bookInfo.language || 'No language available'}</p>
            <p><strong>Preview Link:</strong> <a href="${bookInfo.previewLink}" target="_blank">Preview</a></p>
        `;
        bookModal.style.display = 'block';
    };

    const hideBookModal = () => {
        bookModal.style.display = 'none';
    };

    const showLoading = () => {
        loading.style.display = 'block';
    };

    const hideLoading = () => {
        loading.style.display = 'none';
    };

    toggleDarkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    closeButton.addEventListener('click', hideBookModal);
    window.addEventListener('click', (event) => {
        if (event.target == bookModal) {
            hideBookModal();
        }
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            fetchBooks(query);
        }
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    fetchBooks();
});
