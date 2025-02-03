const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const booksPath = path.join(__dirname, "books.json"); // Kitaplar dosyasının yolu
app.use(express.json()); // JSON veri alışverişi için gerekiyor, yoksa datalar null / undefined dönüyor.

// Ana Dizin
app.get("/", (req, res) => {
  res.status(200).send("Ana Dizine Hoş Geldiniz.");
});

// Tüm Kitapları Getir **************** GET BOOKS

// Kitapları getiren fonksiyon
const readBooks = () => {
  const jsonBooks = fs.readFileSync(booksPath);
  if (jsonBooks.length === 0) {
    return [];
  }
  return JSON.parse(jsonBooks);
};

// Get isteği ->  Query Almadan Hepsini Çekiyoruz

// app.get("/books", (req, res) => {
//   const books = readBooks();
//   res.status(200).send(books);
// });

app.get("/books", (req, res) => {
  // const genre = req.query.genre; // Buradan genre bilgisini alıyoruz.
  // const year = req.query.year; // Buradan year bilgisini alıyoruz.
  // const page = req.query.page; // Buradan page bilgisini alıyoruz.
  // const limit = req.query.limit; // Buradan limit bilgis
  const {genre, year, page, limit} = req.query; // Destructuring ile aynı işlemi yapıyoruz.

  const books = readBooks(); // Tüm kitapları alıyoruz.

  if (year) {
    const filteredBooks = books.filter((book) => book.year === parseInt(year));
    if (filteredBooks.length === 0) {
      return res.status(404).send("Kitap bulunamadı.");
    }
    return res.status(200).send(filteredBooks);
  }


  if (genre) {
    const filteredBooks = books.filter(
      (book) => book.genre.toLowerCase() === genre.toLowerCase()
    ); // Eğer genre varsa filtreleme yapıyoruz.

    if (filteredBooks.length === 0) {
      return res.status(404).send("Kitap bulunamadı.");
    } // Eğer filtreleme sonucunda hiç kitap bulunamazsa 404 dönüyoruz.

    return res.status(200).send(filteredBooks);
  }


  if (page && limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedBooks = books.slice(startIndex, endIndex);
    if (paginatedBooks.length === 0) {
      return res.status(404).send("Kitap bulunamadı.");
    }
    return res.status(200).send(paginatedBooks);
  }


  res.status(200).send(books); // Eğer genre yoksa tüm kitapları gönderiyoruz.
});

// Yeni Kitap Ekle **************** POST BOOK

// Kitapları set eden fonksiyon
const setBooks = (books) => {
  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
};

// Kitap Önceden Eklenmiş mi / MiddleWare
const isTitleExist = (req, res, next) => {
  const title = req.body.title;
  const books = readBooks();
  const book = books.find((book) => book.title === title);
  if (book) {
    return res
      .status(400)
      .send(`Eklemek istediğiniz ${title} isimli kitap zaten mevcut.`);
  }
  next();
};

// HTTP POST isteği ile yeni kitap ekleme
app.post("/books", isTitleExist, (req, res) => {
  let books = readBooks();
  const newBookData = req.body;
  const newBook = {
    id: books.length + 1,
    ...newBookData,
  };
  books.push(newBook);
  setBooks(books);
  res.status(201).send(books);
});

// Kitap Silme **************** DELETE BOOK

// Kitap silme fonksiyonu
const deleteBook = (id) => {
  let books = readBooks();
  books = books.filter((book) => book.id !== id);
  setBooks(books); // Güncellenmiş kitap listesini dosyaya yazdık.
};

// Kitap var mı yok mu kontrolü / MiddleWare
const isBookExist = (req, res, next) => {
  const id = parseInt(req.params.id);
  const books = readBooks();
  const book = books.find((book) => book.id === id);
  if (!book) {
    return res.status(404).send("Kitap bulunamadı.");
  }
  next();
};

// HTTP DELETE isteği ile kitap silme
app.delete("/books/:id", isBookExist, (req, res) => {
  const { id } = req.params;
  deleteBook(parseInt(id));
  return res.status(200).send("Kitap silindi.");
});

// Kitap Güncelleme **************** PUT BOOK

// Kitap güncelleme fonksiyonu
const updateBook = (id, updatedBook) => {
  let books = readBooks();
  const bookIndex = books.findIndex((book) => book.id === id);
  const oldBook = books[bookIndex];
  const newBook = {
    title: updatedBook.title || oldBook.title,
    author: updatedBook.author || oldBook.author,
    genre: updatedBook.genre || oldBook.genre,
    year: updatedBook.year || oldBook.year,
    pages: updatedBook.pages || oldBook.pages,
  };
  books[bookIndex] = { id, ...newBook };
  setBooks(books);
};

// HTTP PUT isteği ile kitap güncelleme
app.put("/books/:id", isBookExist, (req, res) => {
  const { id } = req.params;
  const updatedBook = req.body;
  updateBook(parseInt(id), updatedBook);
  res.status(200).send("Kitap güncellendi.");
});

// Kitap Detayı **************** GET BOOK

// HTTP GET isteği ile kitap detayı

app.get("/books/:id", isBookExist, (req, res) => {
  const id = parseInt(req.params.id);
  const books = readBooks();
  const book = books.find((book) => book.id === id);
  if (book) {
    res.status(200).send(book);
  }
});

// Express üzerinden serveri ayağa kaldırdık.
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portu üzerinde çalışıyor.`);
});
