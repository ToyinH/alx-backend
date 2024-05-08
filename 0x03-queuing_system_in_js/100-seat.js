import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

// Initialize Express app, Redis client, and Kue queue
const app = express();
const client = redis.createClient();
const queue = kue.createQueue();

// Promisify Redis functions
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// Function to reserve seat
async function reserveSeat(number) {
    await setAsync('available_seats', number);
}

// Function to get current available seats
async function getCurrentAvailableSeats() {
    const seats = await getAsync('available_seats');
    return parseInt(seats) || 0;
}

// Initialize available seats to 50 and reservation status to true
reserveSeat(50);
let reservationEnabled = true;

// Route to get available seats
app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: numberOfAvailableSeats });
});

// Route to reserve seat
app.get('/reserve_seat', (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
    }

    const job = queue.create('reserve_seat').save((err) => {
        if (!err) {
            res.json({ status: 'Reservation in process' });
        } else {
            res.json({ status: 'Reservation failed' });
        }
    });
});

// Route to process the queue and reserve seats
app.get('/process', async (req, res) => {
    res.json({ status: 'Queue processing' });

    queue.process('reserve_seat', async (job, done) => {
        const availableSeats = await getCurrentAvailableSeats();
        if (availableSeats === 0) {
            reservationEnabled = false;
            done(new Error('Not enough seats available'));
        } else {
            await reserveSeat(availableSeats - 1);
            if (availableSeats - 1 === 0) {
                reservationEnabled = false;
            }
            done();
        }
    });
});

// Start the server
const port = 1245;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
