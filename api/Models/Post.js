const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const PostSchema = new mongoose.Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  author: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;