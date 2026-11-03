/** Writes dist/ from site.json, template.html, style.css and assets/. */
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"

const site = JSON.parse(readFileSync("site.json", "utf8"))

function stepItem(step) {
  return `<li><b>${step.title}</b><span>${step.text}</span></li>`
}

const values = { ...site, steps: site.steps.map(stepItem).join(""), hubHref: site.hub.href, hubLabel: site.hub.label }

function fill(_, key) {
  if (!(key in values)) throw Error(`Unknown template key ${key}`)
  return values[key]
}

mkdirSync("dist", { recursive: true })
writeFileSync("dist/index.html", readFileSync("template.html", "utf8").replace(/\{\{(\w+)\}\}/g, fill))
writeFileSync("dist/CNAME", new URL(site.url).host + "\n")
cpSync("style.css", "dist/style.css")
cpSync("assets", "dist/assets", { recursive: true })
