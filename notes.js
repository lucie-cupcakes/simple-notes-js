import {Program} from "./program.js"
(async () => {
  try {
    let program = new Program()
    await program.run()
  } catch (e) {
    console.error(e)
  }
})()

