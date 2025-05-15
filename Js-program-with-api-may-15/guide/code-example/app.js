const API_URL = 'http://localhost:3001';
const booksContainer = document.getElementById('books-container');
const addBookForm = document.getElementById('add-book-form');
const editBookForm = document.getElementById('edit-book-form');
const editModal = document.getElementById('edit-modal');
const closeBtn = document.querySelector('.close-btn');
const statusMessage = document.getElementById('status-message');
const loadingMessage = document.getElementById('loading-message');

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    fetchBooks();
    addBookForm.addEventListener('submit', handleAddBook);
    editBookForm.addEventListener('submit', handleEditBook);
    closeBtn.addEventListener('click', () => editModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    });
}

async function fetchBooks() {
    try {
        loadingMessage.style.display = 'block';
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        loadingMessage.style.display = 'none';
        displayBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        loadingMessage.textContent = 'Error loading books. Please try again.';
        showStatusMessage('Error loading books from the server.', 'error');
    }
}

function displayBooks(books) {
    booksContainer.innerHTML = '';
    if (books.length === 0) {
        booksContainer.innerHTML = '<p>No books found. Add some books!</p>';
        return;
    }
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.dataset.id = book.id;
        bookCard.innerHTML = `
        <div class="book-title">${book.title}</div>
        <div class="book-author">By: ${getAuthorNameFromBody(book.body)}</div>
        <div class="book-year">Published: ${book.userId + 2000}</div>
        <div class="book-actions">
          <button class="btn edit-btn" data-id="${book.id}">Edit</button>
          <button class="btn delete-btn" data-id="${book.id}">Delete</button>
        </div>
      `;
        const editBtn = bookCard.querySelector('.edit-btn');
        const deleteBtn = bookCard.querySelector('.delete-btn');
        editBtn.addEventListener('click', () => openEditModal(book));
        deleteBtn.addEventListener('click', () => deleteBook(book.id));
        booksContainer.appendChild(bookCard);
    });
}

function getAuthorNameFromBody(body) {
    const firstWords = body.split(' ').slice(0, 2).join(' ');
    return firstWords.charAt(0).toUpperCase() + firstWords.slice(1);
}

async function handleAddBook(e) {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const year = parseInt(document.getElementById('year').value);
    if (!title || !author || !year) {
        showStatusMessage('Please fill in all fields.', 'error');
        return;
    }
    const newBook = {
        title: title,
        body: `Written by ${author}. ${title} is a great book.`,
        userId: year - 2000
    };
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const createdBook = await response.json();
        showStatusMessage(`Book "${title}" added successfully!`, 'success');
        addBookForm.reset();
        const updatedBooks = await fetch(`${API_URL}/posts`).then(res => res.json());
        displayBooks(updatedBooks);
    } catch (error) {
        console.error('Error adding book:', error);
        showStatusMessage('Error adding book. Please try again.', 'error');
    }
}

function openEditModal(book) {
    document.getElementById('edit-book-id').value = book.id;
    document.getElementById('edit-title').value = book.title;
    document.getElementById('edit-author').value = getAuthorNameFromBody(book.body);
    document.getElementById('edit-year').value = book.userId + 2000;
    editModal.style.display = 'block';
}

async function handleEditBook(e) {
    e.preventDefault();
    const bookId = document.getElementById('edit-book-id').value;
    const title = document.getElementById('edit-title').value.trim();
    const author = document.getElementById('edit-author').value.trim();
    const year = parseInt(document.getElementById('edit-year').value);
    if (!title || !author || !year) {
        showStatusMessage('Please fill in all fields.', 'error');
        return;
    }
    const updatedBook = {
        id: bookId,
        title: title,
        body: `Written by ${author}. ${title} is a great book.`,
        userId: year - 2000
    };
    try {
        const response = await fetch(`${API_URL}/posts/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedBookData = await response.json();
        editModal.style.display = 'none';
        showStatusMessage(`Book "${title}" updated successfully!`, 'success');
        fetchBooks();
    } catch (error) {
        console.error('Error updating book:', error);
        showStatusMessage('Error updating book. Please try again.', 'error');
    }
}

async function updateBookPartially(bookId, updateData) {
    try {
        const response = await fetch(`${API_URL}/posts/${bookId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error with PATCH update:', error);
        throw error;
    }
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/posts/${bookId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        showStatusMessage('Book deleted successfully!', 'success');
        const bookCard = document.querySelector(`.book-card[data-id="${bookId}"]`);
        if (bookCard) {
            bookCard.remove();
        }
        if (booksContainer.children.length === 0) {
            booksContainer.innerHTML = '<p>No books found. Add some books!</p>';
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        showStatusMessage('Error deleting book. Please try again.', 'error');
    }
}

function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message';
    statusMessage.classList.add(type);
    statusMessage.style.display = 'block';
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}
