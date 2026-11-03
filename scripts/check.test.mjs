/** Public-claim checks on the built page. */
import assert from "node:assert"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

const html = readFileSync("dist/index.html", "utf8")

test("page says concept + not for care, in text and beside the video", () => {
  assert.equal(html.match(/Not a medical device\. Not for patient care\./g).length, 3)
})

test("no accuracy claim, no banned word, no open-source claim", () => {
  assert.doesNotMatch(html, /accura|diagnos|software|open[- ]source/i)
})

test("backlink goes to hub card; source says Source on GitHub", () => {
  assert.match(html, /href="https:\/\/juntotechnologies\.com\/#optolab"/)
  assert.match(html, /Source on GitHub/)
})

test("every local asset exists", () => {
  for (const [, file] of html.matchAll(/(?:src|poster)="(assets\/[^"]+)"/g)) assert.ok(existsSync(`dist/${file}`), file)
})
