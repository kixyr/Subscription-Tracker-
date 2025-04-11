const express = require('express')
const router = express.Router()
const {addSubscription, getAllSubscriptions, deleteSubscription, updateSubscription} = require('../controllers/subsciptionHandler')

router.post('/post', addSubscription)
router.get('/get',getAllSubscriptions)
router.delete('/delete/:id', deleteSubscription)
router.patch('/update/:id', updateSubscription)
module.exports = router