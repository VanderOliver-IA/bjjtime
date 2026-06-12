export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Falha ao carregar arquivo.'))
    }

    reader.onerror = () => reject(reader.error ?? new Error('Falha ao carregar arquivo.'))
    reader.readAsDataURL(file)
  })
}
