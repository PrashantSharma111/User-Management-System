const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));


//import dotenc
const mongoURI = process.env.MONGO_URI;


//mongoose connection
mongoose.connect(mongoURI)
.then(()=>console.log("Mongodb connected"))
.catch(err=>console.log("Error connecting mongodb", err));

//Schema for the connection
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    }
})

//model to interact with the model
const User = mongoose.model('User', userSchema);


app.get('/users', (req, res) => {
    User.find({})
    .then(users=> {
        res.status(200).json(users)
    })
    .catch(err=> {
        res.status(500).json({message: err.message});
    })
})

app.post('/users', (req, res)=> {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
    .then((newUser)=> {
        res.status(201).json(newUser);
    })
    .catch(err=> {
        res.status(500).json({messgae: err.message});
    })
    
})


app.put('/users/:id', (req, res)=> {
    const userId = req.params.id;
    const updatedata = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }

    //new true return the new data after updation
    User.findByIdAndUpdate(userId, updatedata, {new: true})
    .then(data=> {
        if(!data){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(data);
    })
    .catch(err=> {
        res.status(400).json({message: err.message});
    })


})

app.delete('/users/:id', (req, res)=> {
    const id = req.params.id;
    User.findByIdAndDelete(id)
    .then(deleteddata=> {
        if(!deleteddata){
            return res.status(404).json({message: 'User not found'});
        }
        res.json({message: 'User deleted successfully'});
    })
    .catch(err=> {
        res.status(400).json({message: err.message});
    })
})

app.listen(PORT, ()=>`Server runnning at PORT:${PORT}`);