"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor({ content, onUpdate }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    immediatelyRender: false,  // Fix SSR hydration warning here
  });

  return (
    <div className="prose prose-sm max-w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
