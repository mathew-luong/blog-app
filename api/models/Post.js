import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type:String, 
        required: true
    },
    author: {
        type:String, 
        required: true
    },
    body: {
        type:String, 
        required: true
    },
    postedDate: {
        type:Date,
        required: true
    },
    likes: {
        type: Map,
        of: Boolean,
    },
    authorId: {
        type:String
    },
    image: {
        type:String
    },
    comments: [
        {
            author: String,
            datePosted: String,
            text: String
        }
    ]
    // comments: {
    //     types: Array,
    //     default: []
    // }
});

const Post = mongoose.model('Post', PostSchema)
export default Post;
