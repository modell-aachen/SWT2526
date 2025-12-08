import fs from 'fs'
import path from 'path'

const extractColors = () => {
    const cssPath = path.resolve('./src/assets/colors.css')
    const cssContent = fs.readFileSync(cssPath, 'utf8')

    // Extract all --variable-name
    const variableRegex = /--([\w0-9-]+):/g
    const colors = {}

    let match
    while ((match = variableRegex.exec(cssContent)) !== null) {
        const varName = match[1]
        // Map Tailwind color key to the CSS variable
        // Example: ma-primary-100 -> var(--ma-primary-100)
        colors[varName] = `var(--${varName})`
    }

    return colors
}

export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: extractColors()
        },
    },
    plugins: [],
}
