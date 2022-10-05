const { registerUser, loginUser, followUser, logoutUser, updatePassword, updateProfile, deleteProfile, myProfile, getUserProfile, getAllUsers } = require('../controllers/user')
const { isAuthenticated } = require('../middlewares/auth')

const router = require('express').Router()

router.post('/register',registerUser)

router.post('/login',loginUser)

router.route('/logout').get(logoutUser)

router.route('/follow/:id').get(isAuthenticated,followUser)

router.route('/update/password').put(isAuthenticated,updatePassword)

router.route('/update/profile').put(isAuthenticated,updateProfile)

router.route('/delete/me').delete(isAuthenticated,deleteProfile)

router.route("/me").get(isAuthenticated,myProfile)

router.route("/user/:id").get(isAuthenticated,getUserProfile)

router.route("/users").get(isAuthenticated,getAllUsers)



module.exports = router






