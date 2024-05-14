"use client"

import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import {useCreateBlockNote} from '@blocknote/react'
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from 'next-themes'
import { useEdgeStore } from '@/lib/edgestore';

interface EditorProps{
      onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { edgestore} = useEdgeStore();
  const {resolvedTheme } = useTheme();

  const uploadHandler = async (file: File) => {
    const res = await edgestore.publicFiles.upload({
      file
    })

    return res.url;
  }

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
    uploadFile: uploadHandler,
  }); 

  return (
    <div>
      <BlockNoteView
        editor={editor}
        onChange={() => onChange(JSON.stringify(editor.document, null, 2))}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable}
      />
    </div>
  )
}

export default Editor;