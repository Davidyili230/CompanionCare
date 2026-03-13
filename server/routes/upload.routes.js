import express from "express"
import multer from "multer"
import path from "path"

const router = express.Router()

const uploadDir = path.join(process.cwd(), "uploads")   // current direction, something/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),  // if no error, set the file to uploadDir
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "")   //ex: xxx.img => .img
    const name = `${Date.now()}-${Math.round(Math.random()* 1e9)}${ext}`  //time+random+9digits+ext
    cb(null,name)
  },
})

const fileFilter = (req,file,cb) => {   //only allowed image/png/jpeg
  if(file.mimetype && file.mimetype.startsWith("image/")){
    cb(null, true)
  }
  else{
    cb(new Error("Only image files are allowed"), false)
  }
}

const upload = multer({   //set up the rule
  storage,
  fileFilter,
  limits: { fileSize: 5*1024*1024 }   // 5MB
})

router.post("/", upload.array("files", 6), (req, res) => {
  const files = req.files || [] // req.files is where file store afrom multer
  const items = files.map((f) => ({
    filename: f.filename,
    url: `/uploads/${f.filename}`,
  }))
  res.status(201).json({ items })
})

export default router

