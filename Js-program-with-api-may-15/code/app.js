const API_URL = 'http://localhost:3001';

// DOM Elements
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

async function handleAddBook(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    if (!title || !author || !year) {
      statusMessage.textContent = 'Please fill in all fields.';
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            body: author,
            userId: parseInt(year) - 2000,
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const newBook = await response.json();
    } catch (error) {
      console.error('Error adding book:', error);
      statusMessage.textContent = 'Error adding book. Please try again.';
    }
}

async function handleEditBook(event) {
    event.preventDefault();
    const bookId = editBookForm.dataset.bookId;
    const title = document.getElementById('edit-title').value;
    const author = document.getElementById('edit-author').value;
    const year = document.getElementById('edit-year').value;
  
    if (!title || !author || !year) {
      statusMessage.textContent = 'Please fill in all fields.';
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/posts/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body: author,
          userId: parseInt(year) - 2000,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const updatedBook = await response.json();
      editModal.style.display = 'none';
      fetchBooks();
    } catch (error) {
      console.error('Error editing book:', error);
      statusMessage.textContent = 'Error editing book. Please try again.';
    }
  }

async function fetchBooks() {
    try {
      // Show loading message
      loadingMessage.style.display = 'block';
  
      // Fetch data from API
      const response = await fetch(`${API_URL}/posts`);
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse the JSON response
      const books = await response.json();
      loadingMessage.style.display = 'none';
        displayBooks(books);
  
    } catch (error) {
      // Handle any errors
      console.error('Error fetching books:', error);
      loadingMessage.textContent = 'Error loading books. Please try again.';
    }
  }
  
  // Display books in the UI
  function displayBooks(books) {
    // Clear the books container first
    booksContainer.innerHTML = '';
  
    // Check if we have any books
    if (books.length === 0) {
      booksContainer.innerHTML = '<p>No books found. Add some books!</p>';
      return;
    }

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.dataset.id = book.id;
        bookCard.dataset.bookId = book.id;
        bookCard.innerHTML = `
        <div class="book-title">${book.title}</div>
        <div class="book-author">By: ${getAuthorNameFromBody(book?.body)}</div>
        <div class="book-year">Published: ${book.userId + 2000}</div>
        <div class="book-actions">
          <button class="btn edit-btn" data-id="${book.id}">Edit</button>
          <button class="btn delete-btn" data-id="${book.id}">Delete</button>
        </div>
      `;
      const editBtn = bookCard.querySelector('.edit-btn');
      const deleteBtn = bookCard.querySelector('.delete-btn');
  
    //   editBtn.addEventListener('click', () => openEditModal(book));
      deleteBtn.addEventListener('click', () => deleteBook(book.id));
      booksContainer.appendChild(bookCard);
    });
  }
  
  // Helper function to extract an author name from the body text
  // In a real app, you'd have proper author data
  function getAuthorNameFromBody(body) {
    // Just grab the first word as a fake author name
    const firstWords = body.split(' ').slice(0, 2).join(' ');
    return firstWords.charAt(0).toUpperCase() + firstWords.slice(1);
  }

  async function deleteBook(id) {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const bookCard = booksContainer.getAttribute(`data-book-id`, id);
      if (bookCard) {
        booksContainer.removeChild(bookCard);
      }
  
      statusMessage.textContent = 'Book deleted successfully.';
    } catch (error) {
      console.error('Error deleting book:', error);
      statusMessage.textContent = 'Error deleting book. Please try again.';
    }
  }