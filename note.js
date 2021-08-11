import {v4 as uuidv4} from "uuid"
export class Note {
  constructor(title, contents) {
    this.id = uuidv4()
    this.title = title
    this.contents = contents
    this.creationTime = new Date()
    this.lastModified = this.creationTime
  }
  static fromJSON(jsonString) {
    let obj = JSON.parse(jsonString)
    let note = new Note("", "")
    note.id = obj.id
    note.title = obj.title
    note.contents = obj.contents
    note.creationTime = obj.creationTime
    note.lastModified = obj.lastModified
    return note
  }
  modify(title, contents) {
    this.title = title
    this.contents = contents
    this.lastModified = new Date()
  }
  toString() {
    let res = "title: " + this.title + "\nCreation time: " + this.creationTime
    res = res + "\nModification time: " + this.lastModified + "\n" + this.contents
    return res
  }
  async save(dbHandle) {
    await dbHandle.saveEntry(this.id, JSON.stringify(this))
  }
  static async load(id, dbHandle) {
    try {
      return Note.fromJSON(await dbHandle.getEntry(id))
    } catch (e) {
      throw "Cannot get note:\n" + e
    }
  }
}

