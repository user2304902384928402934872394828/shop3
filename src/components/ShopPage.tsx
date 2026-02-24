import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Item {
  id: string;
  item_name: string;
  quantity: number;
  price: number;
  purchased: boolean;
}

export default function ShopPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('shop_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (!itemName) return;

    await supabase.from('shop_items').insert({
      item_name: itemName,
      quantity,
      price,
    });

    setItemName('');
    setQuantity(1);
    setPrice(0);
    fetchItems();
  };

  const togglePurchased = async (id: string, current: boolean) => {
    await supabase
      .from('shop_items')
      .update({ purchased: !current })
      .eq('id', id);
    fetchItems();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold bg-purple-700 rounded-xl text-black">
        Shop / Parts List
      </h1>

      <div className="bg-purple-900 p-4 rounded-xl space-y-3">
        <input
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={addItem}
          className="bg-green-600 px-4 py-2 rounded text-white"
        >
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-purple-800 p-3 rounded text-white flex justify-between"
          >
            <div>
              <p className={item.purchased ? 'line-through' : ''}>
                {item.item_name} (x{item.quantity}) - ${item.price}
              </p>
            </div>
            <button
              onClick={() => togglePurchased(item.id, item.purchased)}
              className="bg-blue-600 px-3 py-1 rounded"
            >
              {item.purchased ? 'Undo' : 'Bought'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
