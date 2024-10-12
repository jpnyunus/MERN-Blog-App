const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./Models/User');
const Post = require('./Models/Post');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const uploadMiddleware = multer({ dest: 'uploads/' });

const app = express();
const saltRounds = 10;
const secret = `${process.env.VITE_JWT_SECRET}`;

app.use(cors({ credentials: true, origin: process.env.VITE_FRONTEND_URL}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(`${process.env.VITE_MONGODB}`);

// Kullanıcı kaydı
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, saltRounds),
        });
        res.json(userDoc);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});

// Kullanıcı Giris
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
        return res.status(400).json('wrong credentials');
    }

    const passOk = await bcrypt.compare(password, userDoc.password);

    if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true }).json({
                id: userDoc._id,
                sameSite: 'None',
                username,
            });
        });
    } else {
        res.status(400).json('wrong credentials');
    }
});

// Profil bilgisi
app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ error: 'JWT must be provided' });
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        res.json(info);
    });
});

// Cikis
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: req.file ? `/uploads/${req.file.filename}` : '',
        author: info.id,
      });
      res.json(postDoc);
    });
  });
  
  // Post guncelleme
  app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      if (!postDoc) return res.status(404).json('Post not found');
  
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('You are not the author');
      }
  
      const updatedPost = await Post.findByIdAndUpdate(id, {
        title,
        summary,
        content,
        cover: req.file ? `/uploads/${req.file.filename}` : postDoc.cover,
      }, { new: true });
  
      res.json(updatedPost);
    });
  });

// Tüm postları getir
app.get('/post', async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
});

// Tekil post getir
app.get('/post/:id', (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Please log in to view this post' });
    }

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        const { id } = req.params;
        const postDoc = await Post.findById(id).populate('author', ['username']);

        if (!postDoc) {
            return res.status(404).json('Post not found');
        }

        res.json(postDoc);
    });
});

app.listen(process.env.VITE_PORT, () => console.log('Server listening'));