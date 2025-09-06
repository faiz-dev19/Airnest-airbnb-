const axios = require("axios");
const Listing = require("../models/listing");
const API_KEY = process.env.MAP_KEY;

module.exports.index = async (req, res) => {
  let allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs")
}

module.exports.createListing = async (req, res) => {

  try {
        const { location } = req.body.listing;

    // 1. Fetch coordinates from MapTiler
    const geoResponse = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json`,
      {
        params: {
          key: API_KEY
        }
      }
    );

    // 2. Validate response
    if (!geoResponse.data.features || geoResponse.data.features.length === 0) {
      req.flash("error", "Invalid location. Please try again.");
      return res.redirect("/listings/new");
    }

    // 3. Extract coordinates
    const coordinates = geoResponse.data.features[0].geometry.coordinates;
    // console.log("MapTiler Coordinates:", coordinates);

    // 4. Inject geometry into req.body before saving
    req.body.listing.geometry = {
      type: "Point",
      coordinates: coordinates
    };

    // console.log("Final Data Before Save:", req.body.listing);

    // 5. Save to DB
    const newListing = new Listing({
      ...req.body.listing,
      owner: req.user._id
    });

    // await newListing.save();
          
          // console.log(coordinates);
          // req.flash("success", "New Listing Created Successfully!");
          // res.redirect(`/listings/${newListing._id}`);
        } catch (err) {
          console.error(err);
          req.flash("error", "Something went wrong while creating the listing.");
          res.redirect("/listings/new");
        }   


  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing)
  newListing.owner = req.user._id;
  newListing.image.url = url;
  newListing.image.filename = filename;
  await newListing.save();
  req.flash("success","New Listing Created.");
   res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate({
      path:"reviews",
      populate:{
       path:"author",
    },
  })
  .populate('owner');
  
  if(!listing){
    req.flash("error","Listing does not exist!");
   return res.redirect("/listings");        
  }
  res.render("listings/show.ejs", { listing })
}

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing does not exist!");
   return res.redirect("/listings");        
  }

  let originalImageUrl = listing.image.url;
  
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
  // console.log(originalImageUrl);
  res.render("listings/edit.ejs", { listing ,originalImageUrl})
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image.url = url;
  listing.image.filename = filename;
  await listing.save();
  } 

  req.flash("success","Listing Updated.");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted.");
  res.redirect("/listings")
}