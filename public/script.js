document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("item-form");
  const itemNameInput = document.getElementById("item-name");
  const itemsList = document.getElementById("items-list");

  // Function to fetch items from the API
  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      const items = await response.json();
      updateItemsList(items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Function to update items list in the DOM
  const updateItemsList = (items) => {
    itemsList.innerHTML = "";
    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className =
        "bg-gray-800 p-4 rounded-md mb-2 shadow-md transition-transform transform hover:scale-105";
      listItem.innerHTML = `
        <span>${item.name}</span>
        <button onclick="deleteItem('${item.id}')" class="ml-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-transform transform hover:scale-105">Delete</button>
      `;
      itemsList.appendChild(listItem);
    });
  };

  // Handle form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const itemName = itemNameInput.value.trim();
    if (!itemName) return;

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Date.now().toString(), name: itemName }),
      });
      const newItem = await response.json();
      itemNameInput.value = "";
      await fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  });

  // Function to delete an item
  window.deleteItem = async (id) => {
    try {
      await fetch(`/api/items/${id}`, { method: "DELETE" });
      await fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Initial fetch
  fetchItems();
});
