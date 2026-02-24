import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AddProject({ onAdded }: { onAdded: () => void }) {
  const [vehicleType, setVehicleType] = useState('car');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [color, setColor] = useState('');
  const [engineType, setEngineType] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!make || !model || !year) return;

    const { error } = await supabase.from('automotive_projects').insert({
      vehicle_type: vehicleType,
      make,
      model,
      year,
      color,
      engine_type: engineType,
      notes,
    });

    if (!error) {
      setMake('');
      setModel('');
      setYear('');
      setColor('');
      setEngineType('');
      setNotes('');
      onAdded();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-purple-900 rounded-xl space-y-4"
    >
      <h2 className="text-xl font-bold text-white">Add New Project</h2>

      <select
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white"
      >
        <option value="car">Car</option>
        <option value="truck">Truck</option>
        <option value="quad">Quad</option>
        <option value="dirtbike">Dirtbike</option>
        <option value="motorcycle">Motorcycle</option>
      </select>

      <input
        placeholder="Make"
        value={make}
        onChange={(e) => setMake(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />

      <input
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />

      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />

      <input
        placeholder="Color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />

      <input
        placeholder="Engine Type (V8, 450cc, Electric...)"
        value={engineType}
        onChange={(e) => setEngineType(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />

      <button className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700">
        Save Project
      </button>
    </form>
  );
}
