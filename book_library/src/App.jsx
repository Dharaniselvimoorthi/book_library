import { useEffect, useState } from "react";
import "./App.css";

const API = "https://book-library-929q.onrender.com/books";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const res = await fetch(API);
    const data = await res.json();
    setBooks(data);
  }

  async function addBook() {
    if (!title || !author) {
      alert("Fill all fields");
      return;
    }

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author }),
    });

    setTitle("");
    setAuthor("");
    fetchBooks();
  }

  async function toggleRead(id, status) {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !status }),
    });

    fetchBooks();
  }

  async function deleteBook(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchBooks();
  }

  const filteredBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    )
    .filter((book) => {
      if (filter === "read") return book.read;
      if (filter === "unread") return !book.read;
      return true;
    });

  return (
    <div className={dark ? "dark" : ""}>
      <div className="background"></div>

      <div className="app">
        <h1>📚 Digital Library</h1>

        <div className="controls">
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <button onClick={addBook}>Add</button>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>

          <button onClick={() => setDark(!dark)}>🌙</button>
        </div>

        <div className="books">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className={`card ${book.read ? "read" : "unread"}`}
            >
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.read ? "Read ✅" : "Unread 📖"}</p>

              <button onClick={() => toggleRead(book._id, book.read)}>
                Toggle Read
              </button>

              <button onClick={() => deleteBook(book._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;