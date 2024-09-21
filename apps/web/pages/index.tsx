import React, { useState, useEffect } from 'react';
import { getItems, createItem, updateItem, deleteItem } from '../services/api';
import { Item } from '../types/item';
import Link from 'next/link';

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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Items CRUD</h1>
      <Link href="/social-post">
        <div style={{
          display: 'inline-block',
          padding: '10px 15px',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          marginBottom: '20px'
        }}>
          Create Social Post
        </div>
      </Link>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New item name"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button onClick={handleCreateItem} style={{
          padding: '5px 10px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}>Add Item</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
            {item.name}
            <button onClick={() => handleUpdateItem(item.id, `${item.name} (updated)`)} style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}>
              Update
            </button>
            <button onClick={() => handleDeleteItem(item.id)} style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
