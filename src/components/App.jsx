import React, { useState, useEffect } from "react";
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then(r => r.json())
      .then(data => setToys(data));
  }, []);

  function handleClick() {
    setShowForm(showForm => !showForm);
  }

  function handleAddToy(newToy) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newToy),
    })
      .then(r => r.json())
      .then(added => setToys(prev => [...prev, added]));
  }

  function handleLike(toy) {
    fetch(`http://localhost:3001/toys/${toy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: toy.likes + 1 }),
    })
      .then(r => r.json())
      .then(updated => setToys(prev =>
        prev.map(t => t.id === updated.id ? updated : t)
      ));
  }

  function handleDelete(id) {
    fetch(`http://localhost:3001/toys/${id}`, { method: "DELETE" })
      .then(() => setToys(prev => prev.filter(t => t.id !== id)));
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onLike={handleLike} onDelete={handleDelete} />
    </>
  );
}

export default App;