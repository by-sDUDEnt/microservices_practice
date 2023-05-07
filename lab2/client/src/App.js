import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [vegetables, setVegetables] = useState([]);
  const [newVegetable, setNewVegetable] = useState({ name: '', color: '', quantity: 0 });
  const [editedVegetable, setEditedVegetable] = useState({ id: null, name: '', color: '', quantity: 0 });
  const [deletedVegetableId, setDeletedVegetableId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/vegetables')
      .then((response) => {
        setVegetables(response.data);
      })
      .catch((error) => {
        console.error('Error fetching vegetables:', error);
      });
  }, [vegetables]);

  const addVegetable = () => {
    axios.post('http://localhost:3000/vegetables', newVegetable)
      .then((response) => {
        setVegetables([...vegetables, response.data]);
        setNewVegetable({ name: '', color: '', quantity: 0 });
      })
      .catch((error) => {
        console.error('Error adding vegetable:', error);
      });
  };

  const editVegetable = () => {
    axios.put(`http://localhost:3000/vegetables/${editedVegetable.id}`, editedVegetable)
      .then((response) => {
        const index = vegetables.findIndex((v) => v.id === response.data.id);
        const updatedVegetables = [...vegetables];
        updatedVegetables[index] = response.data;
        setVegetables(updatedVegetables);
        setEditedVegetable({ id: null, name: '', color: '', quantity: 0 });
      })
      .catch((error) => {
        console.error('Error editing vegetable:', error);
      });
  };

  const deleteVegetable = async () => {
    try {
      await axios.delete(`http://localhost:3000/vegetables/${deletedVegetableId}`);
      setDeletedVegetableId(null);
      setVegetables(vegetables.filter((v) => v.id !== deletedVegetableId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Vegetables</h1>

      <h2>Add Vegetable</h2>
      <div>
        <label>Name: </label>
        <input type="text" value={newVegetable.name} onChange={(e) => setNewVegetable({ ...newVegetable, name: e.target.value })} />
      </div>
      <div>
        <label>Color: </label>
        <input type="text" value={newVegetable.color} onChange={(e) => setNewVegetable({ ...newVegetable, color: e.target.value })} />
      </div>
      <div>
        <label>Quantity: </label>
        <input type="number" value={newVegetable.quantity} onChange={(e) => setNewVegetable({ ...newVegetable, quantity: e.target.value })} />
      </div>
      <button onClick={addVegetable}>Add Vegetable</button>
      <h2>Edit Vegetable</h2>
  <div>
    <select value={editedVegetable.id} onChange={(e) => setEditedVegetable({ ...editedVegetable, id: e.target.value })}>
      <option value={null}>Select a vegetable</option>
      {vegetables.map((v) => (
        <option key={v.id} value={v.id}>{v.name}</option>
      ))}
    </select>
  </div>
  {editedVegetable.id && (
    <>
      <div>
        <label>Name: </label>
        <input type="text" value={editedVegetable.name} onChange={(e) => setEditedVegetable({ ...editedVegetable, name: e.target.value })} />
      </div>
      <div>
        <label>Color: </label>
        <input type="text" value={editedVegetable.color} onChange={(e) => setEditedVegetable({ ...editedVegetable, color: e.target.value })} />
      </div>
      <div>
        <label>Quantity: </label>
        <input type="number" value={editedVegetable.quantity} onChange={(e) => setEditedVegetable({ ...editedVegetable, quantity: e.target.value })} />
      </div>
      <button onClick={editVegetable}>Save Changes</button>
    </>
  )}

  <h2>Delete Vegetable</h2>
  <div>
    <select value={deletedVegetableId} onChange={(e) => setDeletedVegetableId(e.target.value)}>
      <option value={null}>Select a vegetable</option>
      {vegetables.map((v) => (
        <option key={v.id} value={v.id}>{v.name}</option>
      ))}
    </select>
    <button onClick={deleteVegetable}>Delete</button>
  </div>

  <h2>Vegetables</h2>
  <ul>
    {vegetables.map((v) => (
      <li key={v.id}>
        {v.name} ({v.color}, {v.quantity})
      </li>
    ))}
  </ul>
</div>);
}

export default App;