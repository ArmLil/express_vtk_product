"use strict";

let db = require("../models");

async function getNotes(req, res) {
  console.log("function getNotes");
  try {
    let notes = await db.Note.findAndCountAll();
    let count = notes.count;

    res.json({
      notes,
      count
    });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function getNoteById(req, res) {
  console.log("function getNoteById");
  try {
    let note = await db.Note.findByPk(req.params.id);
    console.log(note);
    if (note == null) {
      throw new Error("validationError: Note with this id not found!");
    }
    res.json({ note });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function createNote(req, res) {
  console.log("function createNote");
  try {
    let options = {};

    if (req.body.name) {
      options.name = req.body.name;
    } else {
      return res.status(400).send("Bad Request, name required");
    }

    const findNoteByName = await db.Note.findOne({
      where: { name: req.body.name }
    });
    if (findNoteByName) {
      throw new Error("validationError: тип с таким названием уже существует");
    }
    if (req.body.description) options.description = req.body.description;

    const note = await db.Note.findOrCreate({
      where: options
    });

    res.json({ note });
  } catch (error) {
    console.error(error);
    res.json({
      errorMessage: error.message
    });
  }
}

async function updateNote(req, res) {
  console.log("function updateNote");
  try {
    const note = await db.Note.findByPk(req.params.id);
    if (note == null)
      throw new Error("validationError: Note by this id not found!");

    if (req.body.name && note.name != req.body.name) {
      //check name
      //do not let the note to be updated with a name which already exists
      const findNoteByName = await db.Note.findOne({
        where: { name: req.body.name }
      });
      if (findNoteByName) {
        throw new Error(
          "validationError: примечание с таким названием уже существует!"
        );
      }
      note.name = req.body.name;
    }

    if (req.body.description) note.description = req.body.description;

    await note.save();
    res.json({ note });
  } catch (err) {
    console.error(err);
    res.json({ errorMessage: err.message });
  }
}

async function deleteNote(req, res) {
  console.log("function deleteNotes");
  try {
    const note = await db.Note.findByPk(req.params.id);
    if (!note) {
      throw new Error("validationError: Note by this id not found!");
    }
    await note.destroy();
    res.json({ massage: `note with id ${note.id} deleted` });
  } catch (error) {
    console.error(error);
    res.json({ errorMessage: error.message });
  }
}

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
