import React, { useState, useEffect } from 'react';
import { getItems, createItem, updateItem, deleteItem } from '../services/api';
import { Item } from '../types/item';

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await getItems();
    setItems(response.data);
  };

  const handleCreateItem = async () => {
    await createItem({ name: newItemName });
    setNewItemName('');
    fetchItems();
  };

  const handleUpdateItem = async (id: number, name: string) => {
    await updateItem(id, { name });
    fetchItems();
  };

  const handleDeleteItem = async (id: number) => {
    await deleteItem(id);
    fetchItems();
  };

  return (
    <div>
      <h1>Items CRUD</h1>
      <div>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New item name"
        />
        <button onClick={handleCreateItem}>Add Item</button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => handleUpdateItem(item.id, `${item.name} (updated)`)}>
              Update
            </button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
