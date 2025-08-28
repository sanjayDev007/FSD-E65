import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { createChart, getCharts, updateChart, deleteChart } from "../api/chart";
function AddChart() {
  const [title, setTitle] = useState("");
  const [values, setValues] = useState([
    { _id: Date.now(), key: "", value: "" },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [chartId, setChartsId] = useState(null);
  const [data, setData] = useState([]);
  const [state, setState] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const charts = await getCharts();
      setData(charts);
    };
    fetchData();
  }, [state]);
  async function handleSave(chartId) {
    const chartData = {
      title,
      data: values.map((item) => ({ key: item.key, value: item.value })),
    };
    if (isEditing) {
        await updateChart(chartId, chartData);
        setIsEditing(false);
        setChartsId(null);
        setState(!state);
    } else {
         await createChart(chartData);
        setState(!state);
    }
    // Reset form
    setTitle("");
    setValues([{ _id: Date.now(), key: "", value: "" }]);
  }

  function handleEdit(chart_id) {
    if (chartId === chart_id) return;
    setIsEditing(true);
    setChartsId(chart_id);
    const chartToEdit = data.find((chart) => chart._id === chart_id);
    if (chartToEdit) {
      setTitle(chartToEdit.title);
      setValues(
        chartToEdit.data.map((item) => ({
          _id: Date.now(),
          key: item.key,
          value: item.value,
        }))
      );
    }
  }
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Chart Manager</h1>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <input
          type="text"
          placeholder="Chart Title"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <div className="space-y-2">
          {values.map((item) => (
            <div className="flex gap-2" key={item._id}>
              <input
                placeholder="Key"
                className="flex-1 px-3 py-2 border rounded-md"
                value={item.key}
                onChange={(e) => {
                  setValues(
                    values.map((v) =>
                      v._id === item._id ? { ...v, key: e.target.value } : v
                    )
                  );
                }}
              />
              <input
                placeholder="Value"
                className="flex-1 px-3 py-2 border rounded-md"
                value={item.value}
                onChange={(e) => {
                  setValues(
                    values.map((v) =>
                      v._id === item._id ? { ...v, value: e.target.value } : v
                    )
                  );
                }}
              />
              <button
                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                onClick={() =>
                  setValues(values.filter((v) => v._id !== item._id))
                }
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() =>
              setValues([...values, { _id: Date.now(), key: "", value: "" }])
            }
          >
            <Plus size={16} /> Add Row
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => handleSave(chartId)}
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {data.map((chart) => (
          <div className="bg-white rounded-lg shadow-md p-4" key={chart._id}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">{chart.title}</h2>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEdit(chart._id)}
                >
                  <Edit2 size={18} />
                </button>
                <button className="text-red-600 hover:text-red-800"
                  onClick={async() => {
                      await deleteChart(chart._id);
                      setState(!state);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {chart.data.map((item, index) => (
                <div key={`${chart._id}-${index}`} className="flex justify-between px-3 py-1 bg-gray-50 rounded">
                  <span className="font-medium">{item.key}:</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddChart;