import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Quote, Link2, Minus,
  Undo2, Redo2, Eraser, Table as TableIcon, Code2, Heading2, Heading3, Heading4,
  Plus, Minus as MinusIcon, Image as ImageIcon, Loader2
} from 'lucide-react';
import DOMPurify from 'dompurify';

interface RichTextEditorProps {
  value: string;      // HTML content
  onChange: (html: string) => void;
  placeholder?: string;
}

export interface RichTextEditorHandle {
  insertHtml: (html: string) => void;
}

// Allowed tags/attrs for sanitization — blocks script tags, event handlers,
// javascript: URLs, and unsafe embeds per the security requirement.
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'h2', 'h3', 'h4', 'b', 'strong', 'i', 'em', 'u',
    'ul', 'ol', 'li', 'blockquote', 'a', 'hr', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel', 'class'],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

export const RichTextEditor = React.forwardRef<RichTextEditorHandle, RichTextEditorProps>(({ value, onChange, placeholder }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceText, setSourceText] = useState(value);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imgUploading, setImgUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedSelection = useRef<Range | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && !sourceMode) {
      editorRef.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emitChange = useCallback(() => {
    if (editorRef.current) {
      const clean = sanitizeHtml(editorRef.current.innerHTML);
      onChange(clean);
    }
  }, [onChange]);

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emitChange();
  };

  React.useImperativeHandle(ref, () => ({
    insertHtml: (html: string) => {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, html);
      emitChange();
    },
  }));

  const formatBlock = (tag: string) => exec('formatBlock', `<${tag}>`);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedSelection.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedSelection.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current);
    }
  };

  const openLinkModal = () => {
    saveSelection();
    setLinkUrl('');
    setLinkModalOpen(true);
  };

  const insertLink = () => {
    if (!linkUrl.trim()) { setLinkModalOpen(false); return; }
    editorRef.current?.focus();
    restoreSelection();
    let url = linkUrl.trim();
    if (!/^https?:\/\//i.test(url) && !/^mailto:|^tel:/i.test(url)) url = `https://${url}`;
    exec('createLink', url);
    setLinkModalOpen(false);
  };

  // Inline image insertion — reuses the same base64 upload approach used
  // elsewhere in this app (no separate upload backend required).
  const handleImageFileSelected = (file: File) => {
    setImgUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      editorRef.current?.focus();
      const base64 = reader.result as string;
      exec('insertHTML', `<img src="${base64}" alt="" /><p><br></p>`);
      setImgUploading(false);
    };
    reader.onerror = () => setImgUploading(false);
    reader.readAsDataURL(file);
  };

  const insertTable = () => {
    editorRef.current?.focus();
    const rows = 2, cols = 3;
    let html = '<table style="width:100%;border-collapse:collapse;margin:12px 0;"><tbody>';
    for (let r = 0; r < rows; r++) {
      html += '<tr>';
      for (let c = 0; c < cols; c++) {
        html += `<td style="border:1px solid #cbd5e1;padding:8px;min-width:60px;">${r === 0 ? 'Header' : 'Cell'}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    exec('insertHTML', html);
  };

  const addTableRow = () => {
    const table = editorRef.current?.querySelector('table');
    if (!table) return;
    const lastRow = table.querySelector('tr:last-child');
    if (!lastRow) return;
    const newRow = lastRow.cloneNode(true) as HTMLElement;
    newRow.querySelectorAll('td,th').forEach((cell) => { cell.textContent = 'Cell'; });
    lastRow.parentElement?.appendChild(newRow);
    emitChange();
  };

  const removeTableRow = () => {
    const table = editorRef.current?.querySelector('table');
    const rows = table?.querySelectorAll('tr');
    if (!rows || rows.length <= 1) return;
    rows[rows.length - 1].remove();
    emitChange();
  };

  const addTableColumn = () => {
    const table = editorRef.current?.querySelector('table');
    table?.querySelectorAll('tr').forEach((row, i) => {
      const cell = document.createElement(i === 0 ? 'th' : 'td');
      cell.textContent = i === 0 ? 'Header' : 'Cell';
      (cell as HTMLElement).style.cssText = 'border:1px solid #cbd5e1;padding:8px;min-width:60px;';
      row.appendChild(cell);
    });
    emitChange();
  };

  const removeTableColumn = () => {
    const table = editorRef.current?.querySelector('table');
    const firstRow = table?.querySelector('tr');
    const cellCount = firstRow?.children.length || 0;
    if (cellCount <= 1) return;
    table?.querySelectorAll('tr').forEach((row) => {
      row.lastElementChild?.remove();
    });
    emitChange();
  };

  const toggleSourceMode = () => {
    if (!sourceMode) {
      setSourceText(editorRef.current?.innerHTML || '');
      setSourceMode(true);
    } else {
      const clean = sanitizeHtml(sourceText);
      if (editorRef.current) editorRef.current.innerHTML = clean;
      onChange(clean);
      setSourceMode(false);
    }
  };

  const ToolBtn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-slate-50 border-b border-slate-200">
        <ToolBtn onClick={() => formatBlock('h2')} title="Heading 2"><Heading2 size={15} /></ToolBtn>
        <ToolBtn onClick={() => formatBlock('h3')} title="Heading 3"><Heading3 size={15} /></ToolBtn>
        <ToolBtn onClick={() => formatBlock('h4')} title="Heading 4"><Heading4 size={15} /></ToolBtn>
        <ToolBtn onClick={() => formatBlock('p')} title="Paragraph">P</ToolBtn>
        <div className="w-px h-5 bg-slate-200 mx-0.5" />
        <ToolBtn onClick={() => exec('bold')} title="Bold"><Bold size={15} /></ToolBtn>
        <ToolBtn onClick={() => exec('italic')} title="Italic"><Italic size={15} /></ToolBtn>
        <ToolBtn onClick={() => exec('underline')} title="Underline"><Underline size={15} /></ToolBtn>
        <div className="w-px h-5 bg-slate-200 mx-0.5" />
        <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet List"><List size={15} /></ToolBtn>
        <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered List"><ListOrdered size={15} /></ToolBtn>
        <ToolBtn onClick={() => formatBlock('blockquote')} title="Blockquote"><Quote size={15} /></ToolBtn>
        <ToolBtn onClick={openLinkModal} title="Insert Link"><Link2 size={15} /></ToolBtn>
        <ToolBtn onClick={() => fileInputRef.current?.click()} title="Insert Image">
          {imgUploading ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
        </ToolBtn>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleImageFileSelected(e.target.files[0])}
        />
        <ToolBtn onClick={() => exec('insertHorizontalRule')} title="Divider"><Minus size={15} /></ToolBtn>
        <div className="w-px h-5 bg-slate-200 mx-0.5" />
        <ToolBtn onClick={insertTable} title="Insert Table"><TableIcon size={15} /></ToolBtn>
        <ToolBtn onClick={addTableRow} title="Add Row">R<Plus size={10} /></ToolBtn>
        <ToolBtn onClick={removeTableRow} title="Remove Row">R<MinusIcon size={10} /></ToolBtn>
        <ToolBtn onClick={addTableColumn} title="Add Column">C<Plus size={10} /></ToolBtn>
        <ToolBtn onClick={removeTableColumn} title="Remove Column">C<MinusIcon size={10} /></ToolBtn>
        <div className="w-px h-5 bg-slate-200 mx-0.5" />
        <ToolBtn onClick={() => exec('undo')} title="Undo"><Undo2 size={15} /></ToolBtn>
        <ToolBtn onClick={() => exec('redo')} title="Redo"><Redo2 size={15} /></ToolBtn>
        <ToolBtn onClick={() => exec('removeFormat')} title="Clear Formatting"><Eraser size={15} /></ToolBtn>
        <div className="w-px h-5 bg-slate-200 mx-0.5" />
        <button
          type="button"
          onClick={toggleSourceMode}
          className={`ml-auto flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
            sourceMode ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Code2 size={13} />HTML
        </button>
      </div>

      {/* Link modal (small inline popover) */}
      {linkModalOpen && (
        <div className="p-3 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2">
          <input
            type="text"
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && insertLink()}
            placeholder="https://example.com"
            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#128C7E]"
          />
          <button onClick={insertLink} className="px-3 py-1.5 bg-[#075E54] text-white text-xs font-bold rounded-lg cursor-pointer">Add</button>
          <button onClick={() => setLinkModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-500 cursor-pointer">Cancel</button>
        </div>
      )}

      {/* Editable area / HTML source */}
      {sourceMode ? (
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          rows={12}
          className="w-full p-4 text-xs font-mono text-slate-700 focus:outline-none resize-none"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onBlur={emitChange}
          data-placeholder={placeholder}
          className="rich-editor-content min-h-[240px] max-h-[480px] overflow-y-auto p-4 text-sm text-slate-700 leading-relaxed focus:outline-none"
        />
      )}

      <style>{`
        .rich-editor-content:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
        }
        .rich-editor-content h2 { font-size: 1.25rem; font-weight: 800; margin: 0.75rem 0 0.5rem; color: #0f172a; }
        .rich-editor-content h3 { font-size: 1.1rem; font-weight: 800; margin: 0.65rem 0 0.4rem; color: #0f172a; }
        .rich-editor-content h4 { font-size: 1rem; font-weight: 700; margin: 0.5rem 0 0.3rem; color: #1e293b; }
        .rich-editor-content p { margin: 0.5rem 0; }
        .rich-editor-content ul, .rich-editor-content ol { margin: 0.5rem 0 0.5rem 1.25rem; }
        .rich-editor-content li { margin: 0.2rem 0; }
        .rich-editor-content blockquote { border-left: 3px solid #128C7E; padding-left: 0.75rem; color: #475569; font-style: italic; margin: 0.5rem 0; }
        .rich-editor-content a { color: #075E54; text-decoration: underline; }
        .rich-editor-content hr { border: none; border-top: 1px solid #e2e8f0; margin: 1rem 0; }
        .rich-editor-content table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; }
        .rich-editor-content td, .rich-editor-content th { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 0.8rem; }
        .rich-editor-content img { max-width: 100%; border-radius: 12px; margin: 0.5rem 0; }
      `}</style>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
