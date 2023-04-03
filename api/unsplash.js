const { createApi } = require('unsplash-js');
require('dotenv').config();

const unsplash = createApi({
    accessKey: process.env.UNSPLASH_API_KEY,
});

const getThumbnailPhoto = () => {
    unsplash.search.getPhotos({
        query: 'cat',
        page: 1,
        perPage: 1,
        orientation: 'landscape',
    }).then(result => {
        if (result.errors) {
            console.log(result.errors[0])
        } else {
            const thumbnail = result.response
            console.log(thumbnail)
        }
    })
}

module.exports = { getThumbnailPhoto };