import redis from 'redis';

// Create a Redis client
const client = redis.createClient();

// Event listener for successful connection
client.on('connect', () => {
    console.log('Redis client connected to the server');
});

// Event listener for connection error
client.on('error', (err) => {
    console.error(`Redis client not connected to the server: ${err}`);
});

// Function to create and store a hash
function createHash() {
    client.hset('HolbertonSchools', 'Portland', '50', redis.print);
    client.hset('HolbertonSchools', 'Seattle', '80', redis.print);
    client.hset('HolbertonSchools', 'New York', '20', redis.print);
    client.hset('HolbertonSchools', 'Bogota', '20', redis.print);
    client.hset('HolbertonSchools', 'Cali', '40', redis.print);
    client.hset('HolbertonSchools', 'Paris', '2', redis.print);
}

// Function to display the stored hash
function displayHash() {
    client.hgetall('HolbertonSchools', (err, reply) => {
        if (err) {
            console.error(`Error retrieving hash: ${err}`);
        } else {
            console.log('Hash stored in Redis:');
            console.log(reply);
        }
    });
}

// Call the functions
createHash();
displayHash();
