/**
 * Markdown Editor Component
 * TipTap-based WYSIWYG editor for journal entries
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { htmlToMarkdown, markdownToHtml } from '../../utils/markdown';

export function MarkdownEditor({ initialContent = '', onChange, placeholder = 'Start writing...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-rose-400 hover:text-rose-500 underline decoration-rose-200 hover:decoration-rose-300 transition-colors',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: markdownToHtml(initialContent),
    editorProps: {
      attributes: {
        class: 'prose prose-amber max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      onChange?.(markdown);
    },
  });

  // Update editor content when initialContent changes (for loading entries)
  useEffect(() => {
    if (editor && initialContent !== undefined) {
      const html = markdownToHtml(initialContent);
      const currentHtml = editor.getHTML();

      // Only update if content is different to avoid unnecessary rerenders
      if (html !== currentHtml) {
        editor.commands.setContent(html);
      }
    }
  }, [initialContent, editor]);

  if (!editor) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 p-4">
        <div className="text-amber-600 text-sm">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 shadow-sm overflow-hidden">
      <EditorContent editor={editor} />
      <style>{`
        .ProseMirror {
          font-family: 'Crimson Text', serif;
        }

        .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: rgb(120 53 15);
        }

        .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.625rem;
          color: rgb(146 64 14);
        }

        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: rgb(180 83 9);
        }

        .ProseMirror p {
          margin-bottom: 0.75rem;
          color: rgb(28 25 23);
          line-height: 1.75;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .ProseMirror li {
          margin-bottom: 0.25rem;
          color: rgb(28 25 23);
        }

        .ProseMirror code {
          background-color: rgb(254 252 232);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: rgb(146 64 14);
          font-family: 'Monaco', 'Courier New', monospace;
        }

        .ProseMirror pre {
          background-color: rgb(254 252 232);
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
          border: 1px solid rgb(254 243 199);
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
          color: rgb(120 53 15);
        }

        .ProseMirror blockquote {
          border-left: 3px solid rgb(254 215 170);
          padding-left: 1rem;
          margin-left: 0;
          margin-bottom: 0.75rem;
          font-style: italic;
          color: rgb(146 64 14);
        }

        .ProseMirror strong {
          font-weight: 700;
          color: rgb(120 53 15);
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgb(217 119 6);
          opacity: 0.4;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}

export default MarkdownEditor;
