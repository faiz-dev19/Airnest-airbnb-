const express = require('express');
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js")
const reviewControllers = require("../controllers/reviews.js")


//review
//post route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewControllers.postReview));

//review delete route..
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewControllers.destroyReview))

module.exports = router;