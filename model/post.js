const mongoose = require('mongoose');
const { Schema } = mongoose

const postSchema = new Schema({
    name: { type: String },
    location : { type: String },
    likes : { type: String },
    description: {type: String  },
    date : { type: Number },
    PostImage: {type: String},
    user: {type: mongoose.Types.ObjectId ,ref:'User'}
})

const Post = mongoose.model('Post',postSchema)

module.exports = Post;