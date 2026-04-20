"use client";

import { useState, useEffect } from "react";

type Expense = {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
};

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const icons: any = {
    Food: "🍔",
    Travel: "✈️",
    Shopping: "🛒",
    Other: "📦",
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  function addExpense() {
    if (!name || !amount) return;

    const newExpense: Expense = {
      id: Date.now(),
      name,
      amount: Number(amount),
      category,
      date: new Date().toLocaleDateString(),
    };

    setExpenses([newExpense, ...expenses]);
    setName("");
    setAmount("");
  }

  function deleteExpense(id: number) {
    setExpenses(expenses.filter((e) => e.id !== id));
  }

  const filteredExpenses = expenses.filter(
    (e) =>
      (filter === "All" || e.category === filter) &&
      e.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="container">
      <h1 className="title">💸 Expense Tracker</h1>
      <p className="subtitle">Track your spending efficiently</p>

      {/* FILTERS */}
      <div className="filters">
        {["All", "Food", "Travel", "Shopping", "Other"].map((cat) => (
          <button
            key={cat}
            className={filter === cat ? "active" : ""}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="🔍 Search expenses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FORM */}
      <div className="form">
        <input
          placeholder="Expense name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Other</option>
        </select>

        <button className="primary" onClick={addExpense}>
          Add
        </button>
      </div>

      {/* LIST */}
      <ul>
        {filteredExpenses.length === 0 ? (
          <div className="empty">
            <h3>No expenses yet</h3>
            <p>Start adding your first expense 💡</p>
          </div>
        ) : (
          filteredExpenses.map((e) => (
            <li key={e.id}>
              <div>
                <strong>
                  {icons[e.category]} {e.name}
                </strong>
                <p className="meta">
                  ₹{e.amount} • {e.date}
                </p>
              </div>

              <div>
                <span className={`tag ${e.category.toLowerCase()}`}>
                  {e.category}
                </span>
                <button className="danger" onClick={() => deleteExpense(e.id)}>
                  ✕
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* TOTAL */}
      <div className="total">
        <h2 style={{ color: total > 1000 ? "#ef4444" : "#22c55e" }}>
          ₹ {total}
        </h2>
        <p>{filteredExpenses.length} items</p>
      </div>
    </div>
  );
}