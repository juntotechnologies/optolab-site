/** Dev server for dist/ on all interfaces. Prints only the tailnet link. Range support: Safari needs it for video. */
import { execFileSync } from "node:child_process"
import { readFileSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize } from "node:path"

const TYPES = { ".html": "text/html", ".css": "text/css", ".mp4": "video/mp4", ".jpg": "image/jpeg" }
const PORT = Number(process.env.PORT || 8942)

function resolve(url) {
  const path = normalize(decodeURIComponent(url.split("?")[0]))
  return join("dist", path.endsWith("/") ? `${path}index.html` : path)
}

function respond(req, res) {
  const file = resolve(req.url)
  try {
    const body = readFileSync(file)
    const range = /bytes=(\d+)-(\d*)/.exec(req.headers.range || "")
    const type = { "content-type": TYPES[extname(file)] || "application/octet-stream", "accept-ranges": "bytes" }
    if (!range) { res.writeHead(200, { ...type, "content-length": statSync(file).size }); res.end(body); return }
    const start = Number(range[1]), end = range[2] ? Number(range[2]) : body.length - 1
    res.writeHead(206, { ...type, "content-range": `bytes ${start}-${end}/${body.length}` })
    res.end(body.subarray(start, end + 1))
  } catch {
    res.writeHead(404); res.end("not found")
  }
}

createServer(respond).listen(PORT, "0.0.0.0", () => console.log(execFileSync("ops", ["devlink", "--port", String(PORT)], { encoding: "utf8" }).trim()))
