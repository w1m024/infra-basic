import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const docsDir = path.join(root, 'docs')
const errors = []
const ignoredPrefixes = ['http://', 'https://', 'mailto:', '#']

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['.vitepress/dist', '.vitepress/cache'].some((part) => full.includes(part))) return []
      return walk(full)
    }
    return /\.(md|vue|ts|css|mts)$/.test(entry.name) ? [full] : []
  })
}

for (const file of walk(docsDir)) {
  const text = fs.readFileSync(file, 'utf8')
  for (const match of text.matchAll(/href=(["'`])([^"'`]+)\1/g)) {
    const href = match[2]
    if (href.startsWith('/') && !ignoredPrefixes.some((prefix) => href.startsWith(prefix))) {
      errors.push(`${path.relative(root, file)} contains naked root href: ${href}`)
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log('link check ok: no naked root href attributes in docs source')
