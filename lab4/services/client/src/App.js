import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);
  const [vegetables, setVegetables] = useState([]);
  const [newVegetable, setNewVegetable] = useState({ name: '', color: '', quantity: 0 });
  const [editedVegetable, setEditedVegetable] = useState({ id: null, name: '', color: '', quantity: 0 });
  const [deletedVegetableId, setDeletedVegetableId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({id:'', veggie: '', count: 0, address: '' });
  const [editedOrder, setEditedOrder] = useState({ id: null, veggie: '', count: 0, address: '' });
  const [deletedOrderId, setDeletedOrderId] = useState(null);




  useEffect(() => {
    axios.get('http://localhost/vegetables')
      .then((response) => {
        setVegetables(response.data);
      })
      .catch((error) => {
        console.error('Error fetching vegetables:', error);
      });
  }, [count]);

  useEffect(() => {
    axios.get('http://localhost/orders')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, [count]);

  const addVegetable = () => {
    axios.post('http://localhost/vegetables', newVegetable)
      .then((response) => {
        setVegetables([...vegetables, response.data]);
        setNewVegetable({ name: '', color: '', quantity: 0 });
        setCount(count+1)
      })
      .catch((error) => {
        console.error('Error adding vegetable:', error);
      });
  };

  const addOrder = () => {
    const selectedVegetable = vegetables.find((v) => v.name === newOrder.veggie);
    if (!selectedVegetable) {
      console.error('Invalid vegetable selected for order');
      return;
    }

    axios.post('http://localhost/orders', {id: selectedVegetable.id, veggie: newOrder.veggie, count: newOrder.count, address: newOrder.address})
      .then((response) => {
        setOrders([...orders, response.data]);
        setNewOrder({ id : '', veggie: '', count: 0, address: '' });
        setCount(count+1)
      })
      .catch((error) => {
        console.error('Error adding order:', error);
      });
  };

  const editVegetable = () => {
    axios.put(`http://localhost/vegetables/${editedVegetable.id}`, editedVegetable)
      .then((response) => {
        const index = vegetables.findIndex((v) => v.id === response.data.id);
        const updatedVegetables = [...vegetables];
        updatedVegetables[index] = response.data;
        setVegetables(updatedVegetables);
        setEditedVegetable({ id: null, name: '', color: '', quantity: 0 });
        setCount(count+1)
      })
      .catch((error) => {
        console.error('Error editing vegetable:', error);
      });
  };

  const editOrder = () => {
    axios.put(`http://localhost/orders/${editedOrder.id}`, editedOrder)
      .then((response) => {
        const index = orders.findIndex((v) => v.id === response.data.id);
        const updatedOrders = [...orders];
        updatedOrders[index] = response.data;
        setOrders(updatedOrders);
        setEditedOrder({ id: null, veggie: '', count: 0, address: '' });
        setCount(count+1)
      })
      .catch((error) => {
        console.error('Error editing order:', error);
      });
  };


  const deleteVegetable = async () => {
    try {
      await axios.delete(`http://localhost/vegetables/${deletedVegetableId}`);
      setDeletedVegetableId(null);
      setVegetables(vegetables.filter((v) => v.id !== deletedVegetableId));
      setCount(count+1)
    } catch (error) {
      console.error(error);
    }
  };

  const deleteOrder = async () => {
    try {
      await axios.delete(`http://localhost/orders/${deletedOrderId}`);
      setDeletedOrderId(null);
      setOrders(orders.filter((v) => v.id !== deletedOrderId));
      setCount(count+1)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <h1>Vegetables</h1>

        <h2>Add Vegetable</h2>
        <div>
          <label>Veggie: </label>
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
      </div>


      <div>
        <h1>Orders</h1>

        <h2>Add order</h2>
        {/* <div>
          <label>Veggie: </label>
          <input type="text" value={newOrder.veggie} onChange={(e) => setNewOrder({ ...newOrder, veggie: e.target.value })} />
        </div>
        <div>
          <label>Count: </label>
          <input type="number" value={newOrder.count} onChange={(e) => setNewOrder({ ...newOrder, count: e.target.value })} />
        </div>
        <div>
          <label>Addres: </label>
          <input type="text" value={newOrder.address} onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })} />
        </div>
        <button onClick={addOrder}>Add Order</button> */}

        <div>
          <label>Veggie: </label>
          <select value={newOrder.veggie} onChange={(e) => setNewOrder({ ...newOrder, veggie: e.target.value })}>
            <option value="">Select a vegetable</option>
            {vegetables.map((v) => (
              <option key={v.id} value={v.name}>{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Count: </label>
          <input type="number" value={newOrder.count} onChange={(e) => setNewOrder({ ...newOrder, count: e.target.value })} />
        </div>
        <div>
          <label>Address: </label>
          <input type="text" value={newOrder.address} onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })} />
        </div>
        <button onClick={addOrder}>Add Order</button>
        <h2>Edit Order</h2>
        <div>
          <select value={editedOrder.id} onChange={(e) => setEditedOrder({ ...editedOrder, id: e.target.value })}>
            <option value={null}>Select a order</option>
            {orders.map((v) => (
              <option key={v.id} value={v.id}>{v.address} {v.count} {v.veggie}</option>

            ))}
          </select>
        </div>
        {editedOrder.id && (
          <>
            <div>
              <label>Veggie: </label>
              <input type="text" value={editedOrder.veggie} onChange={(e) => setEditedOrder({ ...editedOrder, veggie: e.target.value })} />
            </div>
            <div>
              <label>Count: </label>
              <input type="number" value={editedOrder.count} onChange={(e) => setEditedOrder({ ...editedOrder, count: e.target.value })} />
            </div>
            <div>
              <label>Addres: </label>
              <input type="text" value={editedOrder.address} onChange={(e) => setEditedOrder({ ...editedOrder, address: e.target.value })} />
            </div>
            <button onClick={editOrder}>Save Changes</button>
          </>
        )}

        <h2>Delete Order</h2>
        <div>
          <select value={deletedOrderId} onChange={(e) => setDeletedOrderId(e.target.value)}>
            <option value={null}>Select a order</option>
            {orders.map((v) => (
              <option key={v.id} value={v.id}>{v.address} {v.count} {v.veggie}</option>
            ))}
          </select>
          <button onClick={deleteOrder}>Delete</button>
        </div>

        <h2>Orders</h2>
        <ul>
          {orders.map((v) => (
            <li key={v.id}>
              {v.veggie} ({v.count}, {v.address})
            </li>
          ))}
        </ul>
      </div>

    </div>


  );
}

export default App;