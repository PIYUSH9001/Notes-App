const user_model = require('../models/user_model');
const bcrypt = require('bcrypt');
const shortUrl = require("node-url-shortener");
function handleUserLogin(req, res) {
    res.render("login", {
        invalidUser: false,
        isSubmitted: false,
        UserHasEnteredIncorrectPassword: false,
    });
};



async function handleUserLoginDetails(req, res) {
    try {
        const { user_email, user_password } = req.body;
        const UnknownUser = await user_model.findOne({
            email: user_email,
        });
        if (!UnknownUser) {
            res.render("login", {
                invalidUser: true,
                UserHasEnteredIncorrectPassword: false,
            });
            return;
        }
        const PasswordMatch = await bcrypt.compare(user_password, UnknownUser.password);
        if (!PasswordMatch) {
            res.render("login", {
                UserHasEnteredIncorrectPassword: true,
                invalidUser: false,
            });
            return;
        }
        else {
            // User Enters the home page
            const AuthenticatedUserID = UnknownUser._id;
            res.cookie("UserID", AuthenticatedUserID);
            const usernotes = JSON.stringify(UnknownUser.notes);
            res.cookie("UserNotes", usernotes);
            res.redirect("/home");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

async function handleUserHome(req, res) {
    const userNotes = JSON.parse(req.cookies.UserNotes || "[]");
    res.render("home", { userNotes });
}

async function handleUserSignupDetails(req, res) {
    try {
        const { user_email, user_password, confirm_password } = req.body;
        if (user_password === confirm_password) {
            try {
                const hashed_password = await new Promise((resolve, reject) => {
                    bcrypt.hash(user_password, 2, (err, hash) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(hash);
                        }
                    });
                });
                const newUser = await user_model.create({
                    email: user_email,
                    password: hashed_password,
                });
                const newUserID = newUser._id;
                res.cookie("UserID", newUserID);
                const url = `/home?=${encodeURIComponent(JSON.stringify(newUser.notes))}`;
                res.redirect(url);
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            res.render("signUp", {
                PasswordDoesNotMatch: true,
            });
        }
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

function handleUserSignup(req, res) {
    res.render("signUp", {
        PasswordDoesNotMatch: false,
    });
}

async function handleUserNoteDetails(req, res) {
    //  THIS FUNCTION IS FOR ADDING NEW NOTES
    try {
        const { createdHeading, createdContent } = req.body;
        const userID = req.cookies.UserID;
        const userDetails = await user_model.findById(userID);
        const note = {
            title: createdHeading,
            content: createdContent,
        };
        const existingnote = await userDetails.notes.find(note => note.title === createdHeading && note.content === createdContent);
        if (existingnote) {
            res.status(409).send();
        }
        else {
            const updatedUser = await user_model.findByIdAndUpdate(userID, {
                $push: { notes: note },
            }, { new: true });
            const usernotes = JSON.stringify(updatedUser.notes);
            res.cookie("UserNotes", usernotes);
            res.status(201).send();
        }
    }
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

async function handleUserNoteDelete(req, res) {
    const { CurrentNoteHeading } = req.body;
    const userID = req.cookies.UserID;
    const updatedUser = await user_model.findByIdAndUpdate(userID, {
        $pull: { notes: { title: CurrentNoteHeading } }
    }, { new: true });
    const usernotes = JSON.stringify(updatedUser.notes);
    res.cookie("UserNotes", usernotes);
    res.status(204).send();
}

module.exports = {
    handleUserLogin,
    handleUserLoginDetails,
    handleUserSignup,
    handleUserSignupDetails,
    handleUserHome,
    handleUserNoteDetails,
    handleUserNoteDelete,
};