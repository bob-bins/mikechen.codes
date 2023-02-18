export const uploadTextFromBrowser = (): Promise<string> =>
  new Promise(resolve => {
    const uploader = document.createElement("input")
    uploader.type = "file"
    uploader.accept = ".cells,.txt"
    uploader.style.display = "none"
    uploader.addEventListener("change", () => {
      const files = uploader.files
      if (files.length) {
        const reader = new FileReader()
        reader.addEventListener("load", () => {
          uploader.parentNode.removeChild(uploader)
          resolve(reader.result.toString())
        })
        reader.readAsText(files[0])
      }
    })
    document.body.appendChild(uploader)
    uploader.click()
  })
