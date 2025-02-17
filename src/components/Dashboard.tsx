import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash, Edit } from 'lucide-react';
import { format } from 'date-fns';

type Canvas = {
  id: string;
  name: string;
  preview_url: string;
  created_at: string;
  updated_at: string;
  json_data: string;
};

export default function Dashboard() {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const navigate = useNavigate();

  // Load canvases from local storage
  useEffect(() => {
    const storedCanvases = JSON.parse(localStorage.getItem('canvases') || '[]');
    // Sort canvases by updated_at in descending order
    const sortedCanvases = storedCanvases.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    setCanvases(sortedCanvases);
  }, []);

  const handleCreateNewCanvas = () => {
    const newCanvas: Canvas = {
      id: Date.now().toString(),
      name: `New Canvas ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
      preview_url: 'https://via.placeholder.com/800',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      json_data: JSON.stringify({ version: '5.3.0', objects: [] }) // Empty fabric.js canvas
    };

    const updatedCanvases = [newCanvas, ...canvases];
    setCanvases(updatedCanvases);
    localStorage.setItem('canvases', JSON.stringify(updatedCanvases));

    navigate(`/canvas/${newCanvas.id}`);
  };

  const handleRename = (id: string) => {
    const newName = prompt('Enter new canvas name:');
    if (!newName) return;

    const updatedCanvases = canvases.map(canvas =>
      canvas.id === id ? { ...canvas, name: newName, updated_at: new Date().toISOString() } : canvas
    );

    setCanvases(updatedCanvases);
    localStorage.setItem('canvases', JSON.stringify(updatedCanvases));
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this canvas?')) return;

    const updatedCanvases = canvases.filter(canvas => canvas.id !== id);
    setCanvases(updatedCanvases);
    localStorage.setItem('canvases', JSON.stringify(updatedCanvases));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Canvases</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={handleCreateNewCanvas}
            className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors duration-200 cursor-pointer"
          >
            <div className="text-center">
              <Plus className="mx-auto h-12 w-12 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                Create New Canvas
              </span>
            </div>
          </div>

          {canvases.map((canvas) => (
            <div
              key={canvas.id}
              className="relative dark:bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Link to={`/canvas/${canvas.id}`}>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={canvas.preview_url}
                    alt={canvas.name}
                    className="object-cover rounded-t-lg w-full h-48"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-800">
                    {canvas.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Last edited {format(new Date(canvas.updated_at), 'PPp')}
                  </p>
                </div>
              </Link>

              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleRename(canvas.id)}
                  className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <Edit className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => handleDelete(canvas.id)}
                  className="p-1 rounded bg-red-200 dark:bg-red-700 hover:bg-red-300 dark:hover:bg-red-600"
                >
                  <Trash className="h-4 w-4 text-red-700 dark:text-red-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
