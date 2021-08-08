import got from "got"

export class PepinoDB {
	constructor(url, dbName, password) {
		this.url = url
		this.dbName = dbName
		this.password = password
	}

	#buildUrlForEntry(entryName) {
		let params = "/?password=" + this.password + "&db=" + this.dbName
		params += "&entry=" + entryName
		return new URL(params, this.url)
	}

	async getEntry(entryName) {
		let url = this.#buildUrlForEntry(entryName)
		const res = await got(url)
		if (res.statusCode == 200) {
			return res.body
		} else {
			throw "pepino service error: HTTP error " + res.statusCode + " " + res.body
		}
	}

	async saveEntry(entryName, entryValue) {
		let url = this.#buildUrlForEntry(entryName)
		const res = await got.post(url, {body: entryValue})
		if (res.statusCode == 200) {
			return
		} else {
			throw "pepino service error: HTTP error " + res.statusCode + " " + res.body
		}
	}
}
