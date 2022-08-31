const multer = require('multer')


const storage = multer.memoryStorage()

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
          } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 },
    files: 1,
    storage: storage
})

module.exports = upload