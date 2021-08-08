// import {PepinoDB} from "pepino.js"
import {read} from "fs"
import {v4 as uuidv4} from "uuid"
import * as readline from "readline"

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
    let notes = []
    let exit = false

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    console.log("Welcome to the Notes Program!\n" +
      "TIP: type help for the command list.")
    rl.question("Notes> ", (cmd) => {
      if (cmd.startsWith("help")) {
        console.log("Commands: \n" +
          "new-\tCreate a Note\n" +
          "del-\tDelete a Note\n" +
          "mod-\tModify a Note\n" +
          "list-\tList Notes\n" +
          "print-\tPrint a Note to the screen\n" +
          "exit-\tLeave the program.")
      }
    })
  } catch (e) {
    console.error(e)
  }
})()

