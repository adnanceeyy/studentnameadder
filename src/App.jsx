import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const API = "https://rest-backend-prosevo.onrender.com/students";

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", subject: "", class: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(API);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API}/${editingId}` : API;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await fetch(API).then((r) => r.json());
      setStudents(data);

      setForm({ name: "", age: "", subject: "", class: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error submitting data:", err);
      setError("Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      age: student.age,
      subject: student.subject,
      class: student.class,
    });
    setEditingId(student._id || student.id);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await fetch(API).then((r) => r.json());
      setStudents(data);
    } catch (err) {
      console.error("Error deleting data:", err);
      setError("Failed to delete data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="table w-full border border-green-400 text-center">
        <div className="table-row text-white font-semibold bg-gray-700">
          {["Name", "Age", "Subject", "Class", "Edit", "Delete"].map((h) => (
            <div key={h} className="table-cell border border-yellow-500 p-2">{h}</div>
          ))}
        </div>

        {students.map((s, i) => (
          <div key={s._id || s.id || i} className="table-row hover:bg-[#555555d3]">
            <div className="table-cell border border-green-400 p-2">{s.name}</div>
            <div className="table-cell border border-green-400 p-2">{s.age}</div>
            <div className="table-cell border border-green-400 p-2">{s.subject}</div>
            <div className="table-cell border border-green-400 p-2">{s.class}</div>
            <div
              className="table-cell border border-blue-400 p-2 cursor-pointer"
              onClick={() => handleEdit(s)}
            >
              Edit
            </div>
            <div
              className="table-cell border border-red-500 p-2 cursor-pointer"
              onClick={() => handleDelete(s._id || s.id)}
            >
              Delete
            </div>
          </div>
        ))}
      </div>

      <div className="border border-blue-600 p-3 mt-4 bg-[#3636365e]">
        <h2 className="text-2xl stroke-3 text-red-600 mb-2">
          {editingId ? "Edit Student" : "Add Student"}
        </h2>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border border-red-500 text-2xl p-2"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="border border-green-500 text-2xl p-2"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            className="border border-blue-500 text-2xl p-2"
          />
          <input
            type="text"
            name="class"
            placeholder="Class"
            value={form.class}
            onChange={handleChange}
            className="border border-yellow-500 text-2xl p-2"
          />
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSubmit}
            className="border border-green-500 bg-[#4064401e] flex-1 p-4 cursor-pointer"
          >
            {editingId ? "Update" : "Submit"}
          </button>

          {editingId && (
            <button
              onClick={() => {
                setForm({ name: "", age: "", subject: "", class: "" });
                setEditingId(null);
              }}
              className="border border-red-500 bg-[#641a1a1e] flex-1 p-4 cursor-pointer text-red-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
