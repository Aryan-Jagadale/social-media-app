const { registerUser, loginUser, followUser } = require('../controllers/user')
const { isAuthenticated } = require('../middlewares/auth')

const router = require('express').Router()

router.post('/register',registerUser)

router.post('/login',loginUser)

router.route('/follow/:id').get(isAuthenticated,followUser)

module.exports = router






