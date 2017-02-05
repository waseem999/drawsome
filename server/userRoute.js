'use strict'

const db = require('APP/db')
const express = require('express')
const router = express.Router()

const { mustBeLoggedIn, forbidden } = require('./auth.filters')

const User = db.model('users')
const Drawing = db.model('drawing')
const Version = db.model('version')
const Friendship = db.model('friendship')


router.get('/', forbidden('only admins can list users'), async (req, res, next) => {
	try {
		const users = await User.findAll()
		return res.json(users)
	} catch(next){}
})

router.post('/', async (req, res, next) => {
	try {
		const users = await User.create(req.body)
		return res.status(201).json(user)
	} catch(next){}
})

router.get('/searchbar', mustBeLoggedIn, async (req, res, next) => {
	try {
		const query = req.query.name
		const users = await User.findAll({
			where: {
				$or: [{
					firstName: { $ilike: '%'+query+'%' }
				},{
					lastName: { $ilike: '%'+query+'%' }
				}]
			}
		})
		return res.send(users)
	} catch(next){}
})

router.get('/:id', mustBeLoggedIn, async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id)
		return res.json(user)
	} catch(next){}
})

module.exports = router;
