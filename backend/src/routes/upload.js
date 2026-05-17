const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded'
            })
        }

        res.json({
            imageUrl: `http://localhost:5000/uploads/${req.file.filename}`
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: 'Upload failed'
        })
    }
})

module.exports = router