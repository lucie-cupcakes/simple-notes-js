export class NoteList {
  constructor() {
    this.Value = {}
  }
  static fromJSON(jsonString) {
    let obj = new NoteList()
    obj.Value = JSON.parse(jsonString)
    return obj
  }
  toString() {
    let res = ""
    for (let [key, value] of Object.entries(this.Value)) {
      res = res + "\n" + key + "\t" + value
    }
    return res.trim()
  }
  put(key, value) {
    this.Value[key] = value
  }
  get(key) {
    return this.Value[key]
  }
  has(key) {
    return this.Value.hasOwnProperty(key)
  }
  count() {
    return Object.keys(this.Value).length
  }
  del(key) {
    if (!this.has(key)) {
      throw "Key does not exists"
    }
    delete this.Value[key]
  }
  static async load(dbHandle) {
    return NoteList.fromJSON(await dbHandle.getEntry("List"))
  }
  async save(dbHandle) {
    await dbHandle.saveEntry("List", JSON.stringify(this.Value))
  }
}
