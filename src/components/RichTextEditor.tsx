'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import DOMPurify from 'dompurify';
// import { Button } from './ui/button';

type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
};

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const sanitizeHtml = useCallback((html: string) => {
    return DOMPurify.sanitize(html);
  }, []);

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleImageInsert = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url && editor) {
      if (/^https?:\/\/.+\..+/.test(url)) {
        editor.chain().focus().setImage({ src: url }).run();
        return true;
      } else {
        alert('Please enter a valid URL');
      }
    }
    return false;
  };

  const handleLinkInsert = () => {
    const url = window.prompt('Enter the URL:');
    if (url && editor) {
      if (/^https?:\/\/.+\..+/.test(url)) {
        editor.chain().focus().setLink({ href: url }).run();
      } else {
        alert('Please enter a valid URL');
      }
    }
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
  }: {
    onClick: () => boolean;
    isActive?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={() => {
        onClick();
        editor.commands.focus();
      }}
      className={`p-2 ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      } transition-colors`}
    >
      {children}
    </button>
  );

  return (
    <div className="p-4">
      {!isPreview && (
        <div className="flex flex-wrap gap-2 mb-4">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            Bold
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            Italic
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
          >
            Strike
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive('heading', { level: 1 })}
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive('heading', { level: 2 })}
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            Bullet List
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            Ordered List
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
          >
            Code Block
          </ToolbarButton>
          <ToolbarButton onClick={handleImageInsert}>Add Image</ToolbarButton>
          <ToolbarButton
            onClick={() => {
              handleLinkInsert();
              return editor.isActive('link');
            }}
            isActive={editor.isActive('link')}
          >
            Add Link
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run();
              return true;
            }}
          >
            Insert Table
          </ToolbarButton>
        </div>
      )}
      <div
        className={`editor-content ${
          isPreview
            ? 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none'
            : ''
        }`}
      >
        {isPreview ? (
          <div
            className="p-4 prose-sm prose bg-gray-100 rounded-md sm:prose lg:prose-lg xl:prose-2xl max-w-none dark:bg-gray-800"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(editor.getHTML()) }}
          />
        ) : (
          <EditorContent
            editor={editor}
            className="min-h-[300px] p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none bg-gray-100 dark:bg-gray-800 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200 ease-in-out"
          />
        )}
      </div>
      <div className="mt-4">
        <button type="button" onClick={togglePreview}>
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;
