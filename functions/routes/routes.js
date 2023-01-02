const express = require('express')
const router = express.Router()
const admin = require('firebase-admin')
const { credential, database } = require('firebase-admin')
const serviceAccount = require('../credentials.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
const db = admin.firestore()

router.get('/hello-function', (req, res) => {
  res.status(200).json({ message: 'hello world' })
})
router.post('/test', async (req, res) => {
  try {
    await db
      .collection('testcollection')
      .doc(req.body.email)
      .create({ value: req.body.value })
    return res.status(204).json()
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

router.get('/test/:email', async (req, res) => {
  console.log('get one')
  try {
    const doc = await db.collection('testcollection').doc(req.params.email)
    const item = await doc.get()
    const response = item.data()
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

router.get('/tests/', async (req, res) => {
  try {
    const query = await db.collection('testcollection')
    const querysnapshot = await query.get()
    const docs = querysnapshot.docs
    const response = docs.map((doc) => ({
      id: doc.id,
      value: doc.data().value,
    }))

    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

router.delete('/test/:email', async (req, res) => {
  console.log('deleting')
  try {
    const doc = db.collection('testcollection').doc(req.params.email)
    await doc.delete()
    return res.status(200).json('deleted')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

router.put('/test/:email', async (req, res) => {
  console.log('updating')
  try {
    const doc = db.collection('testcollection').doc(req.params.email)
    await doc.update({
      value: req.body.value,
    })
    return res.status(200).json('updated')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

module.exports = router
