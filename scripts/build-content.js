import fs from 'fs'
import path from 'path'

const srcFile = '/Users/rongrong/三个孩子美国升学规划/family-website/index.html'
const outFile = path.join(process.cwd(), 'src', 'data', 'family-website-content.js')

if (!fs.existsSync(srcFile)) {
  console.warn('Source file not found:', srcFile)
  console.warn('Skipping content sync. Run this script on your local machine.')
  process.exit(0)
}

const html = fs.readFileSync(srcFile, 'utf-8')

const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
if (!bodyMatch) {
  console.error('ERROR: no <body> found in index.html')
  process.exit(1)
}

let body = bodyMatch[1].trim()

// Remove smooth-scroll script (handled by ScrollHandler component)
body = body.replace(/<!-- ={10} SMOOTH SCROLL ={10} -->[\s\S]*$/, '')
body = body.replace(/<script>[\s\S]*?<\/script>\s*$/, '')

// Escape backticks and ${} so the template literal in the output is safe
body = body.replace(/\\/g, '\\\\')
body = body.replace(/`/g, '\\`')
body = body.replace(/\$\{/g, '\\${')

const lines = [
  '// Auto-generated from index.html -- run `npm run build:content` to refresh',
  'const htmlContent = `',
  body,
  '`;',
  '',
  'export function getFamilyWebsiteHtml() {',
  '  return htmlContent;',
  '}',
]

fs.writeFileSync(outFile, lines.join('\n'), 'utf-8')
console.log('Done! Synced ' + body.length + ' chars -> ' + path.relative(process.cwd(), outFile))
