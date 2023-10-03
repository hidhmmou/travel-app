import React, { useState } from "react";
import "./index.css";

function Header() {
    return <h1>SAFARI</h1>;
}

export default function App() {
    const [items, setItems] = useState([]);
    const [sortBy, setSortBy] = useState("input");
    const [sortMode, setSortMode] = useState("ascending");

    function onAddItem(newItem) {
        setItems((oldItems) => [...oldItems, newItem]);
    }

    function onToggle(itemId) {
        setItems(
            items.map((item) =>
                item.id === itemId ? { ...item, packed: !item.packed } : item
            )
        );
    }

    function onDelete(itemId) {
        if (itemId === -1) {
            setItems([]);
            return;
        }
        setItems(items.filter((item) => itemId !== item.id));
    }

    return (
        <div className="app">
            <Header />
            <Form onAddItem={onAddItem} />
            <List
                items={items}
                onToggle={onToggle}
                onDelete={onDelete}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortMode={sortMode}
                setSortMode={setSortMode}
            />
            <Footer items={items} />
        </div>
    );
}

function Footer({ items }) {
    if (!items.length)
        return (
            <p className="stats">
                <em>Start adding some items to your packing list 🚀</em>
            </p>
        );
    const numItems = items.length;
    const numPacked = items.filter((item) => item.packed).length;
    const percentage = Math.round((numPacked / numItems) * 100);

    return (
        <footer className="stats">
            <em>
                {percentage === 100
                    ? "You got everything! Ready to go ✈️"
                    : ` 💼 You have ${numItems} item${
                          numItems === 1 ? "" : "s"
                      } on your list, and you already packed ${numPacked} (${percentage}%)`}
            </em>
        </footer>
    );
}

function Form({ onAddItem }) {
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(1);

    function handleAddItem(e) {
        e.preventDefault();
        if (!description) return;
        const newItem = {
            description,
            quantity,
            packed: false,
            id: Date.now(),
        };
        onAddItem(newItem);
        setDescription("");
        setQuantity(1);
    }
    return (
        <form className="add-form" onSubmit={handleAddItem}>
            <h3>What do you need for your 😍 trip?</h3>
            <select
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
            >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <option value={num} key={num}>
                        {num}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            ></input>
            <button>Add</button>
        </form>
    );
}

function List({
    items,
    onToggle,
    onDelete,
    sortBy,
    setSortBy,
    sortMode,
    setSortMode,
}) {
    let sortedItems = items;

    if (sortBy === "description")
        sortedItems = items
            .slice()
            .sort((a, b) => a.description.localeCompare(b.description));
    else if (sortBy === "packed")
        sortedItems = items
            .slice()
            .sort((a, b) => Number(a.packed) - Number(b.packed));
    if (sortMode === "descending") sortedItems = sortedItems.reverse();
    return (
        <div className="list">
            <ul>
                {sortedItems.map((eachItem) => (
                    <Item
                        item={eachItem}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        key={eachItem.id}
                    />
                ))}
            </ul>

            <div className="actions">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="input">Sort by input order</option>
                    <option value="description">Sort by name</option>
                    <option value="packed">Sort by packed status</option>
                </select>
                <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value)}
                >
                    <option value="ascending">ascending</option>
                    <option value="descending">descending</option>
                </select>
                <button onClick={() => onDelete(-1)}>Clear list</button>
            </div>
        </div>
    );
}

function Item({ item, onToggle, onDelete }) {
    return (
        <li>
            <input
                type="checkbox"
                value={item.packed}
                onChange={() => onToggle(item.id)}
            />
            <span style={item.packed ? { textDecoration: "line-through" } : {}}>
                {item.quantity} {item.description}
            </span>
            <button onClick={() => onDelete(item.id)}>❌</button>
        </li>
    );
}
