// import {PepinoDB} from "pepino.js"
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

(async () => {
  try {
    //let db = new PepinoDB("http://localhost:50200", "notes-js", "caipiroska")
  } catch (e) {
    console.error(e)
  }

  let notes = []
  let exit = false

  console.log("Welcome to the Notes Program!\n" +
    "TIP: type help for the command list.")
  while (!exit) {
    try {
      const cmd = readlinesync.question("notes>")
      if (cmd.startsWith("help")) {
        console.log("Commands: \n" +
          "new-\tCreate a Note\n" +
          "del-\tDelete a Note\n" +
          "mod-\tModify a Note\n" +
          "list-\tList Notes\n" +
          "print-\tPrint a Note to the screen\n" +
          "exit-\tLeave the program.")
      } else if (cmd.startsWith("exit")) {
        exit = true
      } else {
        console.log("Command not found")
      }
    } catch (e) {
      console.error(e)
    }
  }
})()

