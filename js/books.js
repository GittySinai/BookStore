let books = [];
const bookList = document.getElementById('book-list');
const side = document.getElementById('side');
loadBooks()
let currentPage = 1;
const booksPerPage = 5;

function loadBooks() {

    fetch('http://localhost:3000/books')
        .then(response => response.json())
        .then(data => {
            books = data;
            books.sort((a, b) => a.title.localeCompare(b.title));
            displayBookList();
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });

}
function clearSide() {
    side.innerHTML = '';
}

function displayBookList() {
    bookList.innerHTML = '';
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const currentBooks = books.slice(startIndex, endIndex);
    books.sort((a, b) => a.title.localeCompare(b.title));
    

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
        readButton.onclick = () => readBook(book);
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


function clearSide() {
    side.innerHTML = '';
}

function readBook(book) {
    clearSide();

    // יצירת כותרת הספר
    const title = document.createElement('h2');
    title.textContent = book.title;
    side.appendChild(title);

    // יצירת תמונה
    const image = document.createElement('img');
    image.classList.add('book-image')
    image.src = book.image;
    side.appendChild(image);

    // יצירת מחיר
    const price = document.createElement('p');
    price.classList.add('book-price')
    price.textContent = `$${book.price.toFixed(2)}`;
    side.appendChild(price);

    // יצירת תיאור
    const description = document.createElement('p');
    description.classList.add('book-description')
    description.textContent = book.description;
    side.appendChild(description);

    // יצירת כפתור דירוג
    const rateButton = document.createElement('button');
    rateButton.classList.add('rate-book')
    rateButton.textContent = 'Rate';
    side.appendChild(rateButton);

    // יצירת שדה דירוג
    const ratingInput = document.createElement('input');
    ratingInput.type = 'number';
    rateButton.textContent = book.rating;
    ratingInput.min = '1';
    ratingInput.max = '5';
    side.appendChild(ratingInput);
}

function updateBook(book) {
    clearSide();
    const form = document.createElement('form');

    // שדה כותרת
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title:';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = book.title;
    const titleError = document.createElement('div');
    titleError.classList.add('error');
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(titleError);

    // שדה מחיר
    const priceLabel = document.createElement('label');
    priceLabel.textContent = 'Price:';
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.step = '0.01';
    priceInput.value = book.price;
    const priceError = document.createElement('div');
    priceError.classList.add('error');
    form.appendChild(priceLabel);
    form.appendChild(priceInput);
    form.appendChild(priceError);

    // שדה תיאור
    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = 'Description:';
    const descriptionInput = document.createElement('textarea');
    descriptionInput.textContent = book.description;
    const descriptionError = document.createElement('div');
    descriptionError.classList.add('error');
    form.appendChild(descriptionLabel);
    form.appendChild(descriptionInput);
    form.appendChild(descriptionError);

    // כפתור שמירה
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Changes';
    form.appendChild(saveButton);
    side.appendChild(form);

    form.onsubmit = (event) => {
        event.preventDefault();
        titleError.textContent = '';
        priceError.textContent = '';
        descriptionError.textContent = '';
        let valid = true;

        if (!titleInput.value.trim()) {
            titleError.textContent = 'Title is required.';
            valid = false;
        }

        if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
            priceError.textContent = 'Price must be a positive number.';
            valid = false;
        }

        if (!descriptionInput.value.trim()) {
            descriptionError.textContent = 'Description is required.';
            valid = false;
        }

        if (valid) {
            const updatedBook = {
                id: book.id,
                title: titleInput.value,
                price: parseFloat(priceInput.value),
                description: descriptionInput.value,
                image: book.image
            };

            fetch(`http://localhost:3000/books/${book.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBook)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const index = books.findIndex(b => b.id === book.id);
                    if (index !== -1) {
                        books[index] = data; 
                    }
                    loadBooks();
                    clearSide();
                })
                .catch(error => {
                    console.error('Error updating book:', error);
                });
        }
    };
}

function deleteBook(bookId) {
    fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        books = books.filter(book => book.id !== bookId);
        loadBooks();
        clearSide();

    })
    .catch(error => {
        console.error('Error deleting book:', error);
    });
}
function addBook() {
    clearSide();
    const form = document.createElement('form');
    const title = document.createElement('h2');
    title.textContent = 'Add Book:';
    form.appendChild(title);

    // שדה כותרת
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title:';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    const titleError = document.createElement('div');
    titleError.classList.add('error');
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(titleError);

    // שדה מחיר
    const priceLabel = document.createElement('label');
    priceLabel.textContent = 'Price:';
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.step = '0.01';
    const priceError = document.createElement('div');
    priceError.classList.add('error');
    form.appendChild(priceLabel);
    form.appendChild(priceInput);
    form.appendChild(priceError);

    // שדה תיאור
    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = 'Description:';
    const descriptionInput = document.createElement('textarea');
    const descriptionError = document.createElement('div');
    descriptionError.classList.add('error');
    form.appendChild(descriptionLabel);
    form.appendChild(descriptionInput);
    form.appendChild(descriptionError);

    // שדה להוספת URL של תמונה
    const imageLabel = document.createElement('label');
    imageLabel.textContent = 'Image URL:';
    const imageInput = document.createElement('input');
    imageInput.type = 'url'; 
    const imageError = document.createElement('div');
    imageError.classList.add('error');
    form.appendChild(imageLabel);
    form.appendChild(imageInput);
    form.appendChild(imageError);

    // כפתור שמירה
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Add Book';
    form.appendChild(saveButton);
    side.appendChild(form);

    form.onsubmit = (event) => {
        event.preventDefault();
        titleError.textContent = '';
        priceError.textContent = '';
        descriptionError.textContent = '';
        imageError.textContent = '';
        let valid = true;

        if (!titleInput.value.trim()) {
            titleError.textContent = 'Title is required.';
            valid = false;
        }

        if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
            priceError.textContent = 'Price must be a positive number.';
            valid = false;
        }

        if (!descriptionInput.value.trim()) {
            descriptionError.textContent = 'Description is required.';
            valid = false;
        }

        if (!imageInput.value.trim() || !isValidURL(imageInput.value)) {
            imageError.textContent = 'Valid image URL is required.';
            valid = false;
        }

        if (valid) {
            const newBook = {
                id: books.length > 0 ? (Math.max(...books.map(book => book.id)) + 1).toString() : '1',
                title: titleInput.value,
                price: parseFloat(priceInput.value),
                description: descriptionInput.value,
                image: imageInput.value, 
                rating: 0
            };

            fetch('http://localhost:3000/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBook)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    books.push(data);
                    loadBooks();
                    clearSide();
                })
                .catch(error => {
                    console.error('Error adding book:', error);
                });
        }
    };
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
