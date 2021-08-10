import {PepinoDB} from "./pepino.js"
import {read} from "fs"
import {v4 as uuidv4} from "uuid"
import * as readlinesync from "readline-sync"

class Note {
  constructor(title, contents) {
    this.id = uuidv4()
    this.title = title
    this.contents = contents
    this.creationTime = new Date()
    this.lastModified = this.creationTime
  }

  modify(title, contents) {
    this.title = title
    this.contents = contents
    this.lastModified = new Date()
  }
}

function readUntilFinish() {
  console.log("TIP: type @finish@ when you finish.")
  let line = ""
  let result = ""
  while (line = readlinesync.question(">").trim(),
    !line.startsWith("@finish@")) {
    console.log(line)
    result = result + "\n" + line
  }
  return result
}

(async () => {
  let notes
  let db

  try {
    db = new PepinoDB("http://localhost:50200", "notes-js", "caipiroska")
  } catch (e) {
    console.error(e)
    return
  }

  try {
    notes = JSON.parse(await db.getEntry("list"))
  } catch (e) {
    notes = {}
  }
  let exit = false
  console.log("Welcome to the Notes Program!\n" +
    "TIP: type help for the command list.")
  while (!exit) {
    const cmd = readlinesync.question("notes>")
    if (cmd.startsWith("help")) {
      console.log("Commands: \n" +
        "new-\tCreate a Note\n" +
        "del-\tDelete a Note\n" +
        "mod-\tModify a Note\n" +
        "list-\tList Notes\n" +
        "print-\tPrint a Note to the screen\n" +
        "exit-\tLeave the program.")
    } else if (cmd.startsWith("new")) {
      const noteTitle = readlinesync.question("title: ")
      const noteContents = readUntilFinish()

      let note = new Note(noteTitle, noteContents)
      notes[note.id] = note.title
      try {
        console.log("Saving note to the database... (1/2)")
        await db.saveEntry(note.id, JSON.stringify(note))
        console.log("Saving note list to the database... (2/2)")
        await db.saveEntry("list", JSON.stringify(notes))
        console.log("Done")
      } catch (e) {
        console.error(e)
        return
      }
    } else if (cmd.startsWith("list")) {
      if (Object.keys(notes).length > 0) {
        for (let [key, value] of Object.entries(notes)) {
          console.log("Id: " + key + "\nTitle:" + value)
        }
      } else {
        console.log("There are not saved notes.")
      }
    } else if (cmd.startsWith("exit")) {
      console.log("Goodybye.")
      exit = true
    } else {
      console.log("Command not found")
    }
  }
})()

