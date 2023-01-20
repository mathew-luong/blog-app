import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Post from './models/Post.js';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
// Upload images to /uploads/
const upload = multer({ dest: 'uploads/' })


// Secret used to sign JWT tokens
const secret = "secret";
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// Cookie origin is the client
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
// For retrieving images 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads',express.static(__dirname + '/uploads'));

// Local mongodb runs on port 27017, db is called forumapp (collections include users)
await mongoose.connect('mongodb://localhost:27017/forumapp');
const db = mongoose.connection;
db.on('error', (err) => console.log(err));
db.once('open', () => console.log('Connected to database'))

// React app (frontend) runs on port 3000, db server runs on port 4000
app.listen(4000, () => console.log("Server started"));


app.get('/', (req,res) => {
    res.send('Hello world');
})


// Register a new user 
app.post('/signup', (req,res) => {
    const {email, username} = req.body;
    // Hashes the password with a salt in 10 rounds
    const password = bcrypt.hashSync(req.body.password, 10);
    // Create user object with email, username, and hashed password
    const user = new User({email,username,password});

    user.save()
    .then((user) => {
        // User object containing email, username, password, _id
        // Sign token with user id as the payload
        jwt.sign({id: user._id}, secret, (err, token) => {
            if(err) {
                console.log(err);
                res.sendStatus(500);
            }
            else {
                // If successful, send cookie with the token as its value
                res.status(201).cookie('token', token).send();
            }
        })
    })
    .catch(err => {
        console.log(err);
        // Server error
        res.sendStatus(500)
    });
})

// Gets a user (if logged in)
app.get('/user', (req,res) => {
    // Cookie from logged in user
    const token = req.cookies.token;
    // Token only exists if a user is logged in
    if(!token) {
        res.json({});
        return;
    }
    // Verify the token
    const userInfo = jwt.verify(token, secret);
    
    User.findById(userInfo.id)
    .then((user) => {
        res.json(user);
        // res.json({username: user.username});
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
})

// Login a user
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    User.findOne({username}).then(user => {
        if (user && user.username) {
            const correctPass = bcrypt.compareSync(password, user.password);
            if (correctPass) {
                jwt.sign({id:user._id}, secret, (err, token) => {
                    res.cookie('token', token).send();
                });
            } 
            else {
                res.status(401).json('Invalid password');
            }
        } 
        else {
            res.status(401).json('Invalid username or password');
        }
    });
  });

// Logout the user
app.post('/logout', (req,res) => {
    res.cookie('token', '').send();
})


// Gets all the posts in the db sorted by newest to oldest
app.get('/posts', (req,res) => {
    Post.find()
    .sort({postedDate:-1})
    .then((posts) => {
        res.json(posts)
    });
});


// Gets a post by id
app.get('/posts/:id', (req,res) => {
    const postId = req.params.id;
    Post.findById(postId)
    .then((post) => {
        res.json(post)
    });
});

// Search for a post
app.get('/search/:query', (req,res) => {
    const searchQuery = req.params.query;
    // regex for any post containing the searchQuery
    const regex = new RegExp(searchQuery, 'i'); // i for case insensitive
    Post.find({title: {$regex: regex}})
    .then((post) => {
        res.json(post)
    })
    .catch(err => {
        console.log(err)
    })
});



// New post
app.post('/newpost', upload.single('image'), (req,res) => {
    // req.body contains the text fields, req.file contains the post image
    let newPath = "";
    // Check if the new post has an image path (posts can have an image or not)
    if(req.file) {
        // retrieve name and path of image
        const {originalname,path} = req.file;
        // split into parts e.g. name.jpg [name,jpg]
        const parts = originalname.split('.');
        const fileType = parts[parts.length-1];
        // Store uploaded image with its extension e.g. /uploads/uploadedimg.jpg
        newPath = path + '.' + fileType;
        fs.renameSync(path, newPath);
    }

    const newPost = new Post({
        title: req.body.title,
        author: req.body.author,
        body: req.body.body,
        postedDate: req.body.postedDate,
        // {userId: True} if userId has liked this post
        likes: {},
        image: newPath,
        comments: req.body.comments
    });
    newPost.save()
    .then((savedPost) => {
        res.json(savedPost);
    })
    .catch(err => {
        console.log(err);
        // Server error
        res.sendStatus(500)    
    })

});



// Delete a post
app.delete('/delete/posts/:id', (req,res) => {
    const postId = req.params.id;
    Post.findByIdAndDelete(postId)
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(404)
    })
})

// Like a post
app.patch('/like/:id/', (req,res) => {
    const userId = req.body.id;
    const postId = req.params.id;
    Post.findById(postId)
    .then((post) => {
        // Check if this user has liked this post
        const isLiked = post.likes.get(userId);
        const arr = []
        // Unlike this post
        if(isLiked) {
            post.likes.delete(userId);
        }
        // Post isnt liked, so like it
        else {
            post.likes.set(userId,true)
        }
        // Update the post with the new like
        Post.findByIdAndUpdate(
            postId,
            {likes: post.likes },
            {new: true}
        )
        .then((updatedPost) => {
            res.json(updatedPost)
        })
    });
});


// Add a comment to a post
app.patch('/newcomment/:id/', (req,res) => {
    const newComment = {
        author: req.body.author,
        text: req.body.text,
        datePosted: req.body.datePosted
    }
    const postId = req.params.id;
    Post.findById(postId)
    .then((post) => {
        post.comments.push(newComment)
        post.save();
        res.json(post);
    })
})