
const mongoose = require('mongoose');
const initData = require('./data');
const Listing  = require("../models/listing");

main().then((result) => {
  console.log("connection successful..");
}).catch((err) => {
  console.log("error:",err);
});

async function main() {
  mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
  await Listing.deleteMany({});  
  initData.data = initData.data.map((obj) => ({...obj,owner:"68ac2fc2a6349a28e99527f1"}))  
  await Listing.insertMany(initData.data);
  console.log("Data saved..");
  
}
 initDB();



// this is for adding geometry in listing for map

//  const mongoose = require('mongoose');
// const axios = require('axios');
// const Listing = require('../models/listing'); // adjust the path to your model


// const MAPTILER_KEY = process.env.MAP_KEY; // Store your key in .env

// Connect to DB
// mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error(err));

// const addGeometryToListings = async () => {
//   try {
//     const listings = await Listing.find();

//     for (let listing of listings) {
//       const query = `${listing.location}, ${listing.country}`;

//       // Call MapTiler Geocoding API
//       const response = await axios.get(`https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=8Q9XajjR2HWryQZQijKv`);

//       if (response.data.features && response.data.features.length > 0) {
//         const coordinates = response.data.features[0].geometry.coordinates;

//         // Update listing with geometry
//         listing.geometry = {
//           type: 'Point',
//           coordinates: coordinates, // [longitude, latitude]
//         };

//         await listing.save();
//         console.log(`Updated: ${listing.title} -> ${coordinates}`);
//       } else {
//         console.log(`No coordinates found for ${listing.title}`);
//       }
//     }

//     console.log('All listings updated with geometry!');
//     process.exit();
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };

// addGeometryToListings();
