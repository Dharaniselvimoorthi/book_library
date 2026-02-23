const API = "https://book-library-929q.onrender.com/books";

let booksData = [];

window.onload = fetchBooks;

async function fetchBooks() {
    const res = await fetch(API);
    booksData = await res.json();
    renderBooks(booksData);
}

async function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;

    if (!title || !author) return alert("Fill all fields");

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
    });

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";

    fetchBooks();
}

function renderBooks(data) {
    const container = document.getElementById("bookContainer");
    container.innerHTML = "";

    data.forEach(book => {
        const card = document.createElement("div");
        card.className = `card ${book.read ? "read" : "unread"}`;

        card.innerHTML = `
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.read ? "Read ✅" : "Unread 📖"}</p>
            <button onclick="toggleRead('${book._id}', ${book.read})">Toggle read</button>
            <button onclick="deleteBook('${book._id}', this)">Delete</button>
        `;

        container.appendChild(card);
    });
}

async function toggleRead(id, status) {
    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !status })
    });

    fetchBooks();
}

async function deleteBook(id, btn) {
    btn.parentElement.style.transform = "scale(0)";
    btn.parentElement.style.opacity = "0";

    setTimeout(async () => {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        fetchBooks();
    }, 300);
}

/* SEARCH + FILTER */
function applyFilters() {
    const search = document.getElementById("search").value.toLowerCase();
    const filter = document.getElementById("filter").value;

    let filtered = booksData.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search)
    );

    if (filter === "read")
        filtered = filtered.filter(book => book.read);
    else if (filter === "unread")
        filtered = filtered.filter(book => !book.read);

    renderBooks(filtered);
}

/* THEME TOGGLE */
function toggleTheme() {
    document.body.classList.toggle("dark");
}