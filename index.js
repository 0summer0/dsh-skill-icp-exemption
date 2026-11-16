import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const name = 'skill-icp-exemption'
export const inject = ['skills']

const skillDir = fileURLToPath(new URL('./skills/icp-exemption/', import.meta.url))
const skillFile = fileURLToPath(new URL('./skills/icp-exemption/SKILL.md', import.meta.url))

/**
 * Parse the YAML frontmatter subset this package uses: plain scalars, quoted
 * scalars, and folded (>) or literal (|) block scalars. The body stays verbatim.
 */
function parseFrontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(source)
  if (!match) return { data: {}, body: source }
  const data = {}
  const lines = match[1].split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    const pair = /^([A-Za-z0-9_-]+):[ \t]*(.*)$/.exec(line)
    if (!pair) continue
    const key = pair[1]
    let value = pair[2].trim()
    if (/^[>|][+-]?$/.test(value)) {
      const folded = value.startsWith('>')
      const parts = []
      while (i + 1 < lines.length) {
        const next = lines[i + 1]
        const indented = /^[ \t]/.test(next)
        if (!indented && next.trim() !== '') break
        if (next.trim() !== '') parts.push(next.trim())
        i += 1
      }
      value = folded ? parts.join(' ') : parts.join('\n')
    } else if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[key] = value
  }
  return { data, body: source.slice(match[0].length) }
}

export function apply(ctx) {
  const { data, body } = parseFrontmatter(readFileSync(skillFile, 'utf8'))
  const skillName = data.name || 'icp-exemption'
  const description = data.description || ''
  if (!description) {
    throw new Error('dsh-skill-icp-exemption: skills/icp-exemption/SKILL.md needs a description')
  }
  if (!body.trim()) {
    throw new Error('dsh-skill-icp-exemption: skills/icp-exemption/SKILL.md has an empty body')
  }
  return ctx.effect(() =>
    ctx.skills.register({
      name: skillName,
      description,
      ...(data.whenToUse ? { whenToUse: data.whenToUse } : {}),
      content: body.trimStart(),
      resourceBase: { kind: 'directory', path: skillDir },
    }),
  )
}
