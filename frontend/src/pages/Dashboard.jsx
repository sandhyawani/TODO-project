import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const filters = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Done" },
];

function Icon({ name }) {
  const icons = {
    check: (
      <path d="M20 6 9 17l-5-5" />
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    list: (
      <>
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17 15 12 10 7" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-7" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6 18 20H6L5 6" />
        <path d="M10 11v5" />
        <path d="M14 11v5" />
      </>
    ),
    undo: (
      <>
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h10a6 6 0 1 1 0 12h-2" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {icons[name]}
    </svg>
  );
}

function StatCard({ label, value, helper, tone }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-number ${tone || ""}`}>{value}</div>
      <div className="stat-helper">{helper}</div>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon name="list" />
      </div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-text">{text}</div>
    </div>
  );
}

function TaskCard({ todo, onToggle, onDelete }) {
  const isComplete = todo.status === "completed";

  return (
    <article className={`task-card ${isComplete ? "completed" : ""}`}>
      <div className="task-card-main">
        <button
          type="button"
          className={`status-toggle ${isComplete ? "is-complete" : ""}`}
          onClick={() => onToggle(todo)}
          aria-label={isComplete ? "Mark task pending" : "Mark task complete"}
          title={isComplete ? "Mark pending" : "Mark complete"}
        >
          {isComplete && <Icon name="check" />}
        </button>

        <div className="task-content">
          <h3 className="task-title">{todo.title}</h3>
          {todo.description && (
            <p className="task-description">{todo.description}</p>
          )}
          <div className="task-meta">
            <span className={`badge ${isComplete ? "badge-success" : "badge-warning"}`}>
              {isComplete ? "Completed" : "Pending"}
            </span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className={`btn btn-sm ${isComplete ? "btn-warning" : "btn-success"}`}
          onClick={() => onToggle(todo)}
        >
          <Icon name={isComplete ? "undo" : "check"} />
          {isComplete ? "Reopen" : "Done"}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-ghost-danger"
          onClick={() => onDelete(todo._id)}
          title="Delete task"
        >
          <Icon name="trash" />
          Delete
        </button>
      </div>
    </article>
  );
}

function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchTodos = async ({ showLoading = false } = {}) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const res = await axios.get("http://localhost:5000/api/todos");
      setTodos(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Tasks could not be loaded. Please check the server and try again.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let isActive = true;

    axios
      .get("http://localhost:5000/api/todos")
      .then((res) => {
        if (!isActive) {
          return;
        }

        setTodos(Array.isArray(res.data) ? res.data : []);
        setError("");
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        console.log(error);
        setError("Tasks could not be loaded. Please check the server and try again.");
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const completedCount = todos.filter((todo) => todo.status === "completed").length;
  const pendingCount = todos.filter((todo) => todo.status !== "completed").length;
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  const visibleTodos = useMemo(() => {
    const query = search.trim().toLowerCase();

    return todos.filter((todo) => {
      const status = todo.status === "completed" ? "completed" : "pending";
      const matchesFilter = filter === "all" || status === filter;
      const matchesSearch =
        !query ||
        todo.title?.toLowerCase().includes(query) ||
        todo.description?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search, todos]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a task title.");
      return;
    }

    try {
      setSaving(true);
      await axios.post("http://localhost:5000/api/todos/add", {
        title: trimmedTitle,
        description: description.trim(),
      });

      setTitle("");
      setDescription("");
      setError("");
      await fetchTodos();
    } catch (error) {
      console.log(error);
      setError("Task could not be added. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      await fetchTodos();
    } catch (error) {
      console.log(error);
      setError("Task could not be deleted. Please try again.");
    }
  };

  const handleToggleStatus = async (todo) => {
    const newStatus = todo.status === "completed" ? "pending" : "completed";

    try {
      await axios.put(`http://localhost:5000/api/todos/${todo._id}`, {
        title: todo.title,
        description: todo.description,
        status: newStatus,
      });

      await fetchTodos();
    } catch (error) {
      console.log(error);
      setError("Task status could not be updated. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-lockup">
            <span className="brand-mark">TF</span>
            <div>
              <div className="brand-title">TaskFlow</div>
              <div className="brand-subtitle">Dashboard</div>
            </div>
          </div>

          <div className="topbar-actions">
            <span className="user-chip">Workspace</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
              <Icon name="logout" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container dashboard">
        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">Today's workspace</p>
            <h1>Organize the next thing, then move it forward.</h1>
            <p>
              Add tasks on the left, scan your list on the right, and use filters
              when the day gets busy.
            </p>
          </div>

          <aside className="progress-card" aria-label="Task completion progress">
            <div className="progress-card-header">
              <span>Completion</span>
              <span className="progress-value">{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-caption">
              {completedCount} of {todos.length} tasks completed
            </div>
          </aside>
        </section>

        {error && <div className="alert alert-error">{error}</div>}

        <section className="task-stats" aria-label="Task summary">
          <StatCard label="Total tasks" value={todos.length} helper="Everything on your list" />
          <StatCard
            label="Pending"
            value={pendingCount}
            helper="Still needs attention"
            tone="pending"
          />
          <StatCard
            label="Completed"
            value={completedCount}
            helper="Finished and archived here"
            tone="completed"
          />
        </section>

        <section className="task-layout">
          <aside className="task-panel">
            <div className="panel-header">
              <h2>Add task</h2>
              <p>Keep the title short, then add details only when they help.</p>
            </div>

            <form onSubmit={handleAddTodo}>
              <div className="form-group">
                <label htmlFor="task-title">Task title</label>
                <input
                  id="task-title"
                  type="text"
                  className="form-control"
                  placeholder="Example: Send project update"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-description">Details</label>
                <textarea
                  id="task-description"
                  className="form-control"
                  placeholder="Add notes, links, or context"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="task-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || !title.trim()}
                >
                  <Icon name="plus" />
                  {saving ? "Adding..." : "Add task"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setError("");
                  }}
                  disabled={saving || (!title && !description)}
                >
                  Clear
                </button>
              </div>
            </form>
          </aside>

          <section className="task-list-panel">
            <div className="task-list-toolbar">
              <div className="toolbar-row">
                <div className="task-list-title">
                  <h2>My tasks</h2>
                  <p>
                    {todos.length === 0
                      ? "Your list is ready for its first task."
                      : `${visibleTodos.length} visible of ${todos.length} total`}
                  </p>
                </div>

                <div className="toolbar-controls">
                  <label className="search-box" htmlFor="task-search">
                    <Icon name="search" />
                    <input
                      id="task-search"
                      type="search"
                      placeholder="Search tasks"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </label>

                  <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
                    {filters.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`filter-tab ${filter === item.id ? "active" : ""}`}
                        onClick={() => setFilter(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading-row" aria-label="Loading tasks">
                <div className="skeleton-card" />
                <div className="skeleton-card" />
                <div className="skeleton-card" />
              </div>
            ) : todos.length === 0 ? (
              <EmptyState
                title="No tasks yet"
                text="Add your first task and it will appear here immediately."
              />
            ) : visibleTodos.length === 0 ? (
              <EmptyState
                title="No matching tasks"
                text="Try a different search term or switch the filter."
              />
            ) : (
              <div className="task-list">
                {visibleTodos.map((todo) => (
                  <TaskCard
                    key={todo._id}
                    todo={todo}
                    onToggle={handleToggleStatus}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        </section>
      </main>

      <footer className="footer-note">TaskFlow keeps your tasks simple and visible.</footer>
    </div>
  );
}

export default Dashboard;
