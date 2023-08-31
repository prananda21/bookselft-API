const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editByIdBookHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  // menyimpan buku
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  // menampilkan seluruh buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  // menampilkan detail buku
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  // mengubah data buku
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editByIdBookHandler,
  },
  // menghapus buku
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
