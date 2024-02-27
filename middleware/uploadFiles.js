const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Define the filename for uploaded files
    }
});

const upload = multer({ storage: storage });

function uploadFiles(req, res, next) {
    upload.array('files')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: 'Multer error: ' + err.message });
        } else if (err) {
            return res.status(500).json({ message: 'Unknown error: ' + err.message });
        }
        next();
    });
}

module.exports = uploadFiles;
