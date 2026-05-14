import { useEffect, useState } from 'react';
import './App.css';

const API_BASE = '/api/books';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [editingBookId, setEditingBookId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(API_BASE);
      const data = await response.json();
      setBooks(data.data || []);
    } catch (error) {
      console.error(error);
      setMessage('Unable to load books.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setPublishYear('');
    setEditingBookId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !author || !publishYear) {
      setMessage('Please complete all fields.');
      return;
    }

    const payload = {
      title,
      author,
      publishYear: Number(publishYear),
    };

    try {
      const url = editingBookId ? `${API_BASE}/${editingBookId}` : API_BASE;
      const method = editingBookId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      await fetchBooks();
      resetForm();
      setMessage(editingBookId ? 'Book updated.' : 'Book added.');
    } catch (error) {
      console.error(error);
      setMessage('Unable to save book.');
    }
  };

  const handleEdit = (book) => {
    setEditingBookId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setPublishYear(book.publishYear.toString());
    setMessage('Editing book details.');
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      await fetchBooks();
      setMessage('Book deleted.');
      if (editingBookId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setMessage('Unable to delete book.');
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>BookStore</h1>
        <p>Connects to your backend API at <code>/api/books</code>.</p>
      </header>

      <section className="panel">
        <form onSubmit={handleSubmit}>
          <h2>{editingBookId ? 'Edit Book' : 'Add New Book'}</h2>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
            />
          </label>
          <label>
            Author
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </label>
          <label>
            Publish Year
            <input
              type="number"
              value={publishYear}
              onChange={(e) => setPublishYear(e.target.value)}
              placeholder="2026"
            />
          </label>
          <div className="actions">
            <button type="submit">{editingBookId ? 'Update Book' : 'Add Book'}</button>
            {editingBookId && (
              <button type="button" className="secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && <div className="message">{message}</div>}
      </section>

      <section className="panel">
        <h2>Saved Books</h2>
        {books.length === 0 ? (
          <p>No books found yet.</p>
        ) : (
          <ul className="book-list">
            {books.map((book) => (
              <li key={book._id}>
                <div>
                  <strong>{book.title}</strong>
                  <p>{book.author}</p>
                  <span>{book.publishYear}</span>
                </div>
                <div className="row-actions">
                  <button type="button" onClick={() => handleEdit(book)}>
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(book._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
