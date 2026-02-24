import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  vehicle_type: string;
  make: string;
  model: string;
  year: number;
  color: string;
  engine_type: string;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('automotive_projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.vehicle_type === filter);

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditData(project);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from('automotive_projects')
      .update(editData)
      .eq('id', editingId);

    if (!error) {
      fetchProjects();
      cancelEditing();
    } else {
      alert('Error updating project: ' + error.message);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase
      .from('automotive_projects')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchProjects();
    } else {
      alert('Error deleting project: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-3">
        {['all', 'car', 'truck', 'quad', 'dirtbike', 'motorcycle'].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded ${
                filter === type
                  ? 'bg-purple-500 text-black'
                  : 'bg-purple-800 text-white'
              }`}
            >
              {type.toUpperCase()}
            </button>
          )
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((project) =>
          editingId === project.id ? (
            // Editable Form
            <div
              key={project.id}
              className="bg-grey-900 p-4 rounded-xl text-white space-y-2"
            >
              <input
                type="text"
                value={editData.make || ''}
                onChange={(e) =>
                  setEditData({ ...editData, make: e.target.value })
                }
                className="w-full p-1 rounded text-black"
                placeholder="Make"
              />
              <input
                type="text"
                value={editData.model || ''}
                onChange={(e) =>
                  setEditData({ ...editData, model: e.target.value })
                }
                className="w-full p-1 rounded text-black"
                placeholder="Model"
              />
              <input
                type="number"
                value={editData.year || ''}
                onChange={(e) =>
                  setEditData({ ...editData, year: Number(e.target.value) })
                }
                className="w-full p-1 rounded text-black"
                placeholder="Year"
              />
              <input
                type="text"
                value={editData.color || ''}
                onChange={(e) =>
                  setEditData({ ...editData, color: e.target.value })
                }
                className="w-full p-1 rounded text-black"
                placeholder="Color"
              />
              <input
                type="text"
                value={editData.engine_type || ''}
                onChange={(e) =>
                  setEditData({ ...editData, engine_type: e.target.value })
                }
                className="w-full p-1 rounded text-black"
                placeholder="Engine Type"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={saveEdit}
                  className="px-3 py-1 bg-green-600 rounded"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="px-3 py-1 bg-gray-500 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Normal Display
            <div
              key={project.id}
              className="bg-gray-900 p-4 rounded-xl text-white space-y-2"
            >
              <h3 className="text-lg font-bold">
                {project.year} {project.make} {project.model}
              </h3>
              <p>Type: {project.vehicle_type}</p>
              <p>Color: {project.color}</p>
              <p>Engine: {project.engine_type}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => startEditing(project)}
                  className="px-3 py-1 bg-yellow-600 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="px-3 py-1 bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
