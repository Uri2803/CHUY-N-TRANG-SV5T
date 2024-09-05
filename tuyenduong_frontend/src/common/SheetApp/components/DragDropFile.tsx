import React from 'react'

type Props = {
  handleFile: (e: any) => void
}

const DragDropFile: React.FC<Props> = ({ handleFile,children }) => {
  const onDrop = (evt: any) => {
    try {
      evt.stopPropagation()
      evt.preventDefault()
      const files = evt.dataTransfer.files
      if (files && files[0]) handleFile(files[0])
    } catch (error) {
      console.error(error)
    }
  }

  const suppress = (evt: any) => {
    evt.stopPropagation()
    evt.preventDefault()
  }

  return (
    <div onDrop={onDrop} onDragEnter={suppress} onDragOver={suppress}>
      {children}
    </div>
  )
}

export default DragDropFile
