fetch('http://localhost:3000/books')
  .then(response => response.json())
  .then(data => {
    console.log(data); // כאן תוכל לראות את נתוני הספרים
  })
  .catch(error => {
    console.error('Error fetching books:', error);
  });
