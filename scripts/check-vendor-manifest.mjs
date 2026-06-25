import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const gitmodules = fs.readFileSync(path.join(root, '.gitmodules'), 'utf8')
const manifest = fs.readFileSync(path.join(root, 'vendor/MANIFEST.yaml'), 'utf8')

const submodulePaths = [...gitmodules.matchAll(/^\s*path\s*=\s*(.+)$/gm)].map((match) => match[1].trim())
const entries = manifest.split(/\n\s*-\s+name:\s+/).slice(1).map((block) => {
  const name = block.split('\n')[0].trim()
  const get = (key) => block.match(new RegExp(`\\n\\s+${key}:\\s*(.+)`))?.[1]?.trim()
  return {
    name,
    path: get('path'),
    article: get('article'),
    priority: get('priority'),
    category: get('category')
  }
})

const errors = []
const manifestPaths = new Set(entries.map((entry) => entry.path))

for (const submodulePath of submodulePaths) {
  if (!manifestPaths.has(submodulePath)) {
    errors.push(`Missing manifest entry for ${submodulePath}`)
  }
}

for (const entry of entries) {
  if (!entry.path || !submodulePaths.includes(entry.path)) {
    errors.push(`Manifest entry ${entry.name} has invalid path ${entry.path}`)
  }
  if (!entry.article || !fs.existsSync(path.join(root, entry.article))) {
    errors.push(`Manifest entry ${entry.name} points to missing article ${entry.article}`)
  }
}

for (const entry of entries.filter((item) => item.priority === 'P0')) {
  const articlePath = path.join(root, entry.article)
  if (!fs.existsSync(articlePath)) continue

  const articleText = fs.readFileSync(articlePath, 'utf8')
  const localPathPattern = entry.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pathRefs = [...articleText.matchAll(new RegExp(`\`${localPathPattern}[^\\n\`]*\``, 'g'))]
    .map((match) => match[0].slice(1, -1))
  const uniquePathRefs = [...new Set(pathRefs)]

  if (uniquePathRefs.length < 8) {
    errors.push(`P0 article for ${entry.name} must reference at least 8 source paths under ${entry.path}`)
  }

  for (const sourcePath of uniquePathRefs) {
    if (!fs.existsSync(path.join(root, sourcePath))) {
      errors.push(`P0 article for ${entry.name} references missing source path ${sourcePath}`)
    }
  }

  let actualCommit = ''
  try {
    const gitDir = path.join(root, entry.path, '.git')
    if (fs.existsSync(gitDir)) {
      const { execFileSync } = await import('node:child_process')
      actualCommit = execFileSync('git', ['-C', entry.path, 'rev-parse', '--short', 'HEAD'], {
        cwd: root,
        encoding: 'utf8'
      }).trim()
    }
  } catch {
    errors.push(`P0 article for ${entry.name} cannot verify submodule commit at ${entry.path}`)
  }

  if (actualCommit && !articleText.includes(`commit | \`${actualCommit}\``)) {
    errors.push(`P0 article for ${entry.name} must record current commit ${actualCommit}`)
  }

  const requiredMarkers = [
    '```text',
    '## 6. 同层对比',
    '## 7. 最小实验',
    `git submodule update --init --depth 1 ${entry.path}`
  ]

  for (const marker of requiredMarkers) {
    if (!articleText.includes(marker)) {
      errors.push(`P0 article for ${entry.name} is missing required marker: ${marker}`)
    }
  }
}

if (new Set(submodulePaths).size !== entries.length) {
  errors.push(`Expected ${submodulePaths.length} manifest entries, found ${entries.length}`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`vendor manifest ok: ${entries.length} entries cover ${submodulePaths.length} submodules`)
