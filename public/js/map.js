// const API_KEY = API_KEY; // Injected directly from server
//   console.log(API_KEY);

// console.log("this is :",coordinates);
  
    const map = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
      center:listing.geometry.coordinates, // Example: Delhi
      zoom: 9 
    });
     

    // Add a marker
    new maplibregl.Marker({color: "#e10a0aff"})
      .setLngLat(listing.geometry.coordinates)
      .setPopup(
       new maplibregl.Popup({offset:25})
        .setHTML(`<h4>${listing.title}</h4><p>Exact location provided will be after booking</p>`)
        .setMaxWidth("300px"))
      .addTo(map);

