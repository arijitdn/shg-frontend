import React, { useState } from "react";

const initialPosts = [
  { id: 1, name: "A", employees: [] },
  { id: 2, name: "B", employees: [] },
  { id: 3, name: "C", employees: [] },
  { id: 4, name: "D", employees: [] },
  { id: 5, name: "E", employees: [] },
];

const dummyEmployees = [
  { id: 1, name: "Alice", phone: "9876543210", postId: 1, active: true },
  { id: 2, name: "Bob", phone: "9123456780", postId: 2, active: true },
  { id: 3, name: "Charlie", phone: "9988776655", postId: 1, active: false },
  { id: 4, name: "David", phone: "9001122334", postId: 3, active: true },
  { id: 5, name: "Eva", phone: "9112233445", postId: 4, active: true },
];

export default function NicDashboard() {
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState(() =>
    initialPosts.map((p) => ({
      ...p,
      employees: dummyEmployees.filter((e) => e.postId === p.id),
    }))
  );
  const [allEmployees, setAllEmployees] = useState(dummyEmployees);
  const [newEmployee, setNewEmployee] = useState({ name: "", phone: "" });
  const [addToPost, setAddToPost] = useState<number | null>(null);
  const [editEmployee, setEditEmployee] = useState<any>(null);
  const [newPostName, setNewPostName] = useState("");
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editPostName, setEditPostName] = useState("");

  // Add new post
  function handleAddPost() {
    if (!newPostName.trim()) return;
    const id = Math.max(0, ...posts.map((p) => p.id)) + 1;
    setPosts((prev) => [
      ...prev,
      { id, name: newPostName.trim(), employees: [] },
    ]);
    setNewPostName("");
  }

  // Edit post name
  function handleEditPostName(postId: number) {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, name: editPostName } : p))
    );
    setEditPostId(null);
    setEditPostName("");
  }

  // Add employee to post
  function handleAddEmployee(postId: number) {
    if (!newEmployee.name || !newEmployee.phone) return;
    const id = Math.max(0, ...allEmployees.map((e) => e.id)) + 1;
    const emp = {
      id,
      name: newEmployee.name,
      phone: newEmployee.phone,
      postId,
      active: true,
    };
    setAllEmployees((prev) => [...prev, emp]);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, employees: [...p.employees, emp] } : p
      )
    );
    setNewEmployee({ name: "", phone: "" });
    setAddToPost(null);
  }

  // Update employee details
  function handleUpdateEmployee() {
    setAllEmployees((prev) =>
      prev.map((e) => (e.id === editEmployee.id ? { ...editEmployee } : e))
    );
    setPosts((prev) =>
      prev.map((p) => ({
        ...p,
        employees: p.employees.map((e: any) =>
          e.id === editEmployee.id ? { ...editEmployee } : e
        ),
      }))
    );
    setEditEmployee(null);
  }

  // Toggle active/inactive
  function handleToggleActive(emp: any) {
    const updated = { ...emp, active: !emp.active };
    setAllEmployees((prev) => prev.map((e) => (e.id === emp.id ? updated : e)));
    setPosts((prev) =>
      prev.map((p) => ({
        ...p,
        employees: p.employees.map((e: any) => (e.id === emp.id ? updated : e)),
      }))
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">NIC Dashboard</h1>
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded font-semibold shadow ${
            tab === "posts"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setTab("posts")}
        >
          Manage Posts
        </button>
        <button
          className={`px-6 py-2 rounded font-semibold shadow ${
            tab === "employees"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setTab("employees")}
        >
          Manage Employees
        </button>
      </div>
      {tab === "posts" && (
        <>
          {/* Create New Post Section */}
          <div className="mb-8 flex gap-2 items-end">
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
              placeholder="New Post Name"
              value={newPostName}
              onChange={(e) => setNewPostName(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
              onClick={handleAddPost}
            >
              Create Post
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-stone-50 border border-zinc-300 rounded-lg p-6 shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  {editPostId === post.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        className="px-2 py-1 border rounded"
                        value={editPostName}
                        onChange={(e) => setEditPostName(e.target.value)}
                      />
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-semibold"
                        onClick={() => handleEditPostName(post.id)}
                      >
                        Save
                      </button>
                      <button
                        className="px-2 py-1 text-red-500 font-bold"
                        onClick={() => setEditPostId(null)}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <h2
                      className="text-xl font-bold text-neutral-700 cursor-pointer hover:underline"
                      onClick={() => {
                        setEditPostId(post.id);
                        setEditPostName(post.name);
                      }}
                    >
                      Post {post.name}
                    </h2>
                  )}
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-semibold"
                    onClick={() => setAddToPost(post.id)}
                  >
                    + Add Employee
                  </button>
                </div>
                {addToPost === post.id && (
                  <div className="mb-4 flex gap-2 items-end">
                    <input
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      placeholder="Employee Name"
                      value={newEmployee.name}
                      onChange={(e) =>
                        setNewEmployee((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    <input
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      placeholder="Phone Number"
                      value={newEmployee.phone}
                      onChange={(e) =>
                        setNewEmployee((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold"
                      onClick={() => handleAddEmployee(post.id)}
                    >
                      Add
                    </button>
                    <button
                      className="px-2 py-2 text-red-500 font-bold"
                      onClick={() => setAddToPost(null)}
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4">
                  {post.employees.length === 0 && (
                    <div className="text-neutral-400 italic">
                      No employees yet.
                    </div>
                  )}
                  {post.employees.map((emp: any) => (
                    <div
                      key={emp.id}
                      className={`rounded-lg p-4 shadow flex flex-col gap-2 border ${
                        emp.active
                          ? "border-green-400 bg-white"
                          : "border-red-300 bg-red-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg text-neutral-700">
                            {emp.name}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {emp.phone}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            emp.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {emp.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {tab === "employees" && (
        <div className="bg-stone-50 border border-zinc-300 rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold text-neutral-700 mb-4">
            All Employees
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-zinc-200 rounded-lg bg-white">
              <thead>
                <tr className="bg-stone-50">
                  <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                    S. No.
                  </th>
                  <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                    Name
                  </th>
                  <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                    Phone
                  </th>
                  <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                    Post
                  </th>
                  <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                    Status
                  </th>
                  <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts
                  .flatMap((post) =>
                    post.employees.map((emp: any) => ({
                      ...emp,
                      postName: post.name,
                    }))
                  )
                  .sort((a, b) => {
                    if (a.postName < b.postName) return -1;
                    if (a.postName > b.postName) return 1;
                    return 0;
                  })
                  .map((emp, idx) => (
                    <tr key={emp.id} className="border-t border-zinc-200">
                      <td className="p-3 text-neutral-700">{idx + 1}</td>
                      <td className="p-3 text-neutral-700 font-medium">
                        {editEmployee && editEmployee.id === emp.id ? (
                          <input
                            className="px-2 py-1 border rounded"
                            value={editEmployee.name}
                            onChange={(e) =>
                              setEditEmployee((prev: any) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          emp.name
                        )}
                      </td>
                      <td className="p-3 text-neutral-700">
                        {editEmployee && editEmployee.id === emp.id ? (
                          <input
                            className="px-2 py-1 border rounded"
                            value={editEmployee.phone}
                            onChange={(e) =>
                              setEditEmployee((prev: any) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          emp.phone
                        )}
                      </td>
                      <td className="p-3 text-neutral-700">{emp.postName}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            emp.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {emp.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2 items-center">
                        {editEmployee && editEmployee.id === emp.id ? (
                          <>
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-semibold"
                              onClick={handleUpdateEmployee}
                            >
                              Save
                            </button>
                            <button
                              className="px-2 py-1 text-red-500 font-bold"
                              onClick={() => setEditEmployee(null)}
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs font-semibold"
                              onClick={() => setEditEmployee(emp)}
                            >
                              Edit
                            </button>
                            <button
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                emp.active
                                  ? "bg-red-500 text-white hover:bg-red-600"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                              onClick={() => handleToggleActive(emp)}
                            >
                              {emp.active ? "Mark Inactive" : "Mark Active"}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
