module.exports = {
  '*.{js,jsx,ts,tsx}': (files) => {
    // Skip ESlint for files in the scripts directory
    const nonScriptFiles = files.filter((file) => !file.includes('/scripts/'))

    if (nonScriptFiles.length === 0) {
      return ['prettier --write ' + files.join(' ')]
    } else {
      return [
        `eslint --fix --quiet ${nonScriptFiles.join(' ')}`,
        `prettier --write ${files.join(' ')}`,
      ]
    }
  },
  '*.{json,md,css,scss}': ['prettier --write'],
}
