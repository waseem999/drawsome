'use strict'


const db = require('APP/db')
const express = require('express')
const router = express.Router()

const {mustBeLoggedIn, forbidden,} = require('./auth.filters')

const User = db.model('users')
const Drawing = db.model('drawing')



router.get('/', forbidden('only admins can list users'), (req, res, next) => {
	User.findAll()
	.then(users => res.json(users))
	.catch(next)
})

router.post('/', (req, res, next) => {
	User.create(req.body)
	.then(user => res.status(201).json(user))
	.catch(next)
})

router.get('/:id', mustBeLoggedIn, (req, res, next) => { 
	User.findById(req.params.id)
	.then(user => res.json(user))
	.catch(next)
})

router.get('/:id/friends', mustBeLoggedIn, (req, res, next) => {
	return User.findById(req.params.id,{
		include: [{model: User, as: 'friend', include: [Drawing]}]
	})
	.then((user) => {
		res.json(user)
	})
	.catch(next)
})



module.exports = router;


