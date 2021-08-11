import {PepinoDB} from "./pepino.js"
import {Note} from "./note.js"
import {NoteList} from "./noteList.js"
import * as readlinesync from "readline-sync"
export class Program {
  #dbHandle
  #noteList
  #cmdInput
  constructor() {
    this.#dbHandle = new PepinoDB("http://localhost:50200", "NotesJS", "caipiroska")
  }
  async run() {
    try {
      this.#noteList = await NoteList.load(this.#dbHandle)
    } catch (e) {
      this.#noteList = new NoteList()
    }
    console.log("Welcome to the Notes Program!\n" +
      "TIP: type help for the command list.")
    while (true) {
      this.#cmdInput = readlinesync.question("notes>")
      if (this.#cmdInput.startsWith("exit")) {
        break
      } else if (this.#cmdInput.startsWith("new")) {
        await this.#newCommand()
      } else if (this.#cmdInput.startsWith("del")) {
        await this.#deleteCommand()
      } else if (this.#cmdInput.startsWith("mod")) {
        await this.#modifyCommand()
      } else if (this.#cmdInput.startsWith("list")) {
        await this.#listCommand()
      } else if (this.#cmdInput.startsWith("print")) {
        await this.#printCommand()
      } else if (this.#cmdInput.startsWith("help")) {
        await this.#helpCommand()
      }
    }
  }
  #readUntilFinish() {
    console.log("TIP: type @finish@ when you finish.")
    let line = ""
    let result = ""
    while (line = readlinesync.question(">").trim(),
      !line.startsWith("@finish@")) {
      result = result + "\n" + line
    }
    return result
  }
  async #helpCommand() {
    console.log("Commands:\n" +
      "new-\tCreate a Note\n" +
      "del-\tDelete a Note\n" +
      "mod-\tModify a Note\n" +
      "list-\tList Notes\n" +
      "print-\tPrint a Note to the screen\n" +
      "exit-\tLeave the program.")
  }
  async #newCommand() {
    try {
      const noteTitle = readlinesync.question("title: ")
      const noteContents = this.#readUntilFinish()
      let note = new Note(noteTitle, noteContents)
      this.#noteList.put(note.id, note.title)
      note.save(this.#dbHandle)
      this.#noteList.save(this.#dbHandle)
    } catch (e) {
      console.error(e)
    }
  }
  async #deleteCommand() {
    try {
      let inArr = this.#cmdInput.split(" ")
      if (inArr.length < 2 && inArr[1] === undefined) {
        console.log("Usage: del <Note Id>")
        return
      }
      let noteId = inArr[1].trim()
      if (noteId == "") {
        console.log("Invalid note Id.")
        return
      }
      if (!this.#noteList.has(noteId)) {
        console.log("The note does not exists.")
        return
      }
      await this.#dbHandle.deleteEntry(noteId)
      this.#noteList.del(noteId)
      this.#noteList.save(this.#dbHandle)
    } catch (e) {
      console.error(e)
    }
  }
  async #modifyCommand() {
    try {
      let inArr = this.#cmdInput.split(" ")
      if (inArr.length < 2 && inArr[1] === undefined) {
        console.log("Usage: mod <Note Id>")
        return
      }
      let noteId = inArr[1].trim()
      if (noteId == "") {
        console.log("Invalid note Id.")
        return
      }
      let note = await Note.load(noteId, this.#dbHandle)
      console.log(note.toString())
      const noteTitle = readlinesync.question("title: ")
      const noteContents = this.#readUntilFinish()
      note.modify(noteTitle, noteContents)
      this.#noteList.put(note.id, note.title)
      await this.#noteList.save(this.#dbHandle)
      await note.save(this.#dbHandle)
    } catch (e) {
      console.error(e)
    }
  }
  async #listCommand() {
    try {
      if (this.#noteList.count() > 0) {
        console.log(this.#noteList.toString())
      } else {
        console.log("There are not saved notes.")
      }
    } catch (e) {
      console.error(e)
    }
  }
  async #printCommand() {
    try {
      let inArr = this.#cmdInput.split(" ")
      if (inArr.length < 2 && inArr[1] === undefined) {
        console.log("Usage: print <Note Id>")
        return
      }
      let noteId = inArr[1].trim()
      if (noteId == "") {
        console.log("Invalid note Id.")
        return
      }
      const note = await Note.load(noteId, this.#dbHandle)
      console.log(note.toString())
    } catch (e) {
      console.error(e)
    }
  }
}
