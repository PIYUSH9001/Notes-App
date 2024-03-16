const express = require('express');
const user_router = express.Router();
const {
    handleUserLogin,
    handleUserLoginDetails,
    handleUserSignup,
    handleUserSignupDetails,
    handleUserHome,
    handleUserNoteDetails,
    handleUserNoteDelete,
} = require('../controllers/controller');

user_router.get('/home',handleUserHome);

user_router.post('/addNote',handleUserNoteDetails);

user_router.delete('/deleteNote',handleUserNoteDelete);

user_router.get('/login',handleUserLogin);

user_router.post('/login',handleUserLoginDetails);

user_router.get('/signup',handleUserSignup);

user_router.post('/signup',handleUserSignupDetails);

module.exports = user_router;