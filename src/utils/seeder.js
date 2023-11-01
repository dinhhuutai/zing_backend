const Genre = require('../app/models/Genre');
const db = require('../config/db');

const genres = require('../config/data/genre.json');

// Connect to DB
db.connect();

const seed = async () => {
    try {

        await Genre.deleteMany();
        console.log('are deleted');

        await Genre.insertMany(genres);
        console.log('All are added.')

        process.exit();

    } catch(error) {
        console.log(error.message);
        process.exit();
    }
}

seed();