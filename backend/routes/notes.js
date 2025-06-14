const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const multer = require('multer');

const storage = multer.memoryStorage(); // Switch to memoryStorage
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// route 1: get user all the notes, login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    // console.log(error.message);
    res.status(500).send("Internal server error occur");
  }
});

// route 2: add new notes, login required
router.post(
  "/addnote",
  fetchuser,
  upload.array('images'),
  [
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("content", "content must be at least 8 characters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      const images = req.files ? req.files.map(file => file.buffer) : []; 
      const { title, content } = req.body;
      
      const result = validationResult(req);
      if (!result.isEmpty()) {
        console.log("Validation errors:", result.array());
        return res.status(400).json({ errors: result.array() });
      }
      
      const note = new Note({
        title,
        content,
        image: images,
        user: req.user.id,
      });
      
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      // console.log("Error:", error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// route 3: update note, login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, content } = req.body;
  // create new note object
  const newNote = {};
  if (title) { newNote.title = title; }
  if (content) { newNote.content = content; }

  // find the note to update
  let note = await Note.findById(req.params.id);
  if (!note) { return res.status(404).send("Not Found"); }

  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }

  note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
  res.json({ note });
});

// route 4: delete note, login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found"); }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ "success": "note has been deleted" });
  } catch (error) {
    // console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;