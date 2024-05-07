import redis from 'redis';

// Create a Redis client for subscribing
const subscriberClient = redis.createClient();

// Event listener for successful connection
subscriberClient.on('connect', () => {
    console.log('Redis client connected to the server');
});

// Event listener for connection error
subscriberClient.on('error', (err) => {
    console.error(`Redis client not connected to the server: ${err}`);
});

// Subscribe to the channel 'holberton school channel'
subscriberClient.subscribe('holberton school channel');

// Event listener for incoming messages
subscriberClient.on('message', (channel, message) => {
    console.log(`Received message on channel ${channel}: ${message}`);
    if (message === 'KILL_SERVER') {
        // Unsubscribe and quit when receiving 'KILL_SERVER' message
        subscriberClient.unsubscribe();
        subscriberClient.quit();
    }
});
