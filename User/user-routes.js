const express=require('express')
const userController=require('./user-controller')
const protect=require('../middleware/protect')

const router= express.Router()

router.use(protect)

router
.route('/')
.get(userController.getUsers)
.post(userController.createUser)

router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)

module.exports= router