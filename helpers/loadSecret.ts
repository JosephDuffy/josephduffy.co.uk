import fs from "fs"

export function loadSecret(name: string): Promise<string | undefined> {
  return new Promise(resolve => {
    if (process.env[name] !== undefined) {
      resolve(process.env[name])
    } else {
      const secretPath = `/run/secrets/${name}`
      fs.readFile(secretPath, "utf8", (err, secret) => {
        if (err) {
          resolve(undefined)
        } else if (secret) {
          resolve(secret)
        }
      })
    }
  })
}
