const {nanoid} = require('nanoid');
const bookself = require('./books');

// handler dengan method POST untuk menyimpan sebuah buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name === null || name === '' || !name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const isFinished = (pageCount, readPage) => {
    if (pageCount === readPage) {
      return true;
    } else {
      return false;
    }
  };
  const finished = isFinished(pageCount, readPage);

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };
  bookself.push(newBook);

  const isSuccess = bookself.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// handler dengan method GET untuk melihat semua buku
const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (name) {
    const filterName = name.toLowerCase();
    const response = h.response({
      status: 'success',
      data: {
        books: bookself
            .filter((n) => n.name === filterName)
            .map((books) => ({
              id: books.id,
              name: books.name,
              publisher: books.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  };

  if (reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: bookself
            .filter((n) => n.reading === false)
            .map((books) => ({
              id: books.id,
              name: books.name,
              publisher: books.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  };

  if (reading === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: bookself
            .filter((n) => n.reading === true)
            .map((books) => ({
              id: books.id,
              name: books.name,
              publisher: books.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  };

  if (finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: bookself
            .filter((n) => n.finished === false)
            .map((books) => ({
              id: books.id,
              name: books.name,
              publisher: books.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  };

  if (finished === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: bookself
            .filter((n) => n.finished === true)
            .map((books) => ({
              id: books.id,
              name: books.name,
              publisher: books.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  };

  const response = h.response({
    status: 'success',
    data: {
      books: bookself.map((n) => ({
        id: n.id,
        name: n.name,
        publisher: n.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};


// handler dengan method GET untuk melihat buku sesuai id
const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const book = bookself.filter((n) => n.id === bookId)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// handler dengan method PUT untuk mengubah data buku sesuai id
const editByIdBookHandler = (request, h) => {
  const {bookId} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  };

  const updatedAt = new Date().toISOString();
  const index = bookself.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookself[index] = {
      ...bookself[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// handler dengan method DELETE untuk menghapus buku sesuai id
const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const index = bookself.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookself.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editByIdBookHandler,
  deleteBookByIdHandler,
};
