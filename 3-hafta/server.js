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
  return JSON.parse(jsonBooks);
};
// Get isteği
app.get("/books", (req, res) => {
  const books = readBooks();
  res.status(200).send(books);
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
  res.status(204).send("Kitap silindi.");
});


// Kitap Güncelleme **************** PUT BOOK

// Kitap güncelleme fonksiyonu
const updateBook = (id, updatedBook) => {
  let books = readBooks();
  const bookIndex = books.findIndex((book) => book.id === id);
  books[bookIndex] = { id, ...updatedBook };
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
    const book = books.find(book => book.id === id);
    if(book){
        res.status(200).send(book);
    }
});





// Express üzerinden serveri ayağa kaldırdık.
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portu üzerinde çalışıyor.`);
});
