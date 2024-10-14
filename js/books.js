let books = [];
const bookList = document.getElementById('book-list');
const bookDetails = document.getElementById('book-details');
const bookTitle = document.getElementById('book-title');
const bookImage = document.getElementById('book-image');
const bookPrice= document.getElementById('book-price');
const bookDescription = document.getElementById('book-description');
const rateBook = document.getElementById('rate-book');
const bookRating = document.getElementById('book-rating');

let currentPage = 1;
const booksPerPage = 5;

fetch('http://localhost:3000/books')
    .then(response => response.json())
    .then(data => {
        books = data;
        displayBookList();
    })
    .catch(error => {
        console.error('Error fetching books:', error);
    });

function displayBookList() {
    bookList.innerHTML = '';
    books.sort((a, b) => a.title.localeCompare(b.title));

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const currentBooks = books.slice(startIndex, endIndex);
    
    currentBooks.forEach(book => {
        const row = document.createElement('tr');

        // עמודת ID
        const idCell = document.createElement('td');
        idCell.textContent = book.id;
        row.appendChild(idCell);

        // עמודת Title
        const titleCell = document.createElement('td');
        titleCell.textContent = book.title;
        row.appendChild(titleCell);

        // עמודת Price
        const priceCell = document.createElement('td');
        priceCell.textContent = `$${book.price.toFixed(2)}`; 
        row.appendChild(priceCell);

        // עמודת Action
        const actionCell = document.createElement('td');
        actionCell.classList.add('action-buttons');

        // כפתור Read
        const readButton = document.createElement('button');
        readButton.textContent = 'Read';
        readButton.classList.add('read-button');
        readButton.onclick = () => showBookDetails(book);
        actionCell.appendChild(readButton);

        // כפתור Update
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add('update-button');
        updateButton.onclick = () => updateBook(book);
        actionCell.appendChild(updateButton);

        // כפתור Delete
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteBook(book.id);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        bookList.appendChild(row);
    });

    updatePaginationInfo();
}

function updatePaginationInfo() {
    const totalPages = Math.ceil(books.length / booksPerPage);
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;

}

function changePage(direction) {
    const totalPages = Math.ceil(books.length / booksPerPage);

    if (direction === -1 && currentPage > 1) {
        currentPage--; 
    } else if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    }

    displayBookList();
}

function showBookDetails(book) {



}

function updateBook(book) {
    // הוסף כאן את הקוד לעדכון הספר
    console.log('Update book with ID:', book.id);
}

function deleteBook(bookId) {
    // הוסף כאן את הקוד למחיקת הספר
    console.log('Delete book with ID:', bookId);
}
