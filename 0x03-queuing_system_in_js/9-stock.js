import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// Initialize Express app and Redis client
const app = express();
const client = redis.createClient();

// Promisify Redis functions
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// Array of products
const listProducts = [
    { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
    { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
    { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
    { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

// Function to get item by ID
function getItemById(id) {
    return listProducts.find(item => item.itemId === id);
}

// Function to reserve stock by item ID
async function reserveStockById(itemId, stock) {
    await setAsync(`item_${itemId}`, stock);
}

// Function to get current reserved stock by item ID
async function getCurrentReservedStockById(itemId) {
    const reservedStock = await getAsync(`item_${itemId}`);
    return parseInt(reservedStock) || 0;
}

// Route to get list of products
app.get('/list_products', (req, res) => {
    res.json(listProducts.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        price: item.price,
        initialAvailableQuantity: item.initialAvailableQuantity
    })));
});

// Route to get product details by item ID
app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);
    if (!item) {
        return res.json({ status: 'Product not found' });
    }
    const currentQuantity = item.initialAvailableQuantity - await getCurrentReservedStockById(itemId);
    res.json({
        itemId: item.itemId,
        itemName: item.itemName,
        price: item.price,
        initialAvailableQuantity: item.initialAvailableQuantity,
        currentQuantity: currentQuantity
    });
});

// Route to reserve product by item ID
app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const item = getItemById(itemId);
    if (!item) {
        return res.json({ status: 'Product not found' });
    }
    const currentReservedStock = await getCurrentReservedStockById(itemId);
    if (currentReservedStock >= item.initialAvailableQuantity) {
        return res.json({ status: 'Not enough stock available', itemId: itemId });
    }
    await reserveStockById(itemId, currentReservedStock + 1);
    res.json({ status: 'Reservation confirmed', itemId: itemId });
});

// Start the server
const port = 1245;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
