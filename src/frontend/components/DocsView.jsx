import React, { useState, useEffect, useRef } from 'react';

// Custom inline parser (backticks, bold text, markdown links)
const parseInline = (text) => {
  if (!text) return '';
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);
  
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-black text-terminal-black">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="bg-terminal-black/15 text-black px-1.5 py-0.5 font-mono text-sm font-bold rounded">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('[') && part.includes('](')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return (
          <a 
            key={idx} 
            href={match[2]} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-black underline font-bold hover:bg-terminal-black hover:text-phosphor-green px-0.5 transition-all"
          >
            {match[1]}
          </a>
        );
      }
    }
    return part;
  });
};

// Render Markdown Tables
const renderTable = (rows, key) => {
  const parsedRows = rows.map(r => r.split('|').map(cell => cell.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1));
  const header = parsedRows[0];
  const body = parsedRows.slice(2); // Skip divider row
  
  return (
    <div key={key} className="my-4 overflow-x-auto border border-terminal-black brutalist-shadow">
      <table className="min-w-full text-left font-sans text-sm select-text border-collapse">
        <thead className="bg-terminal-black text-phosphor-green font-mono uppercase text-xs">
          <tr>
            {header.map((col, i) => (
              <th key={i} className="p-3 border-r border-terminal-black/30 last:border-0 font-black">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-phosphor-green/5">
          {body.map((row, rIdx) => (
            <tr key={rIdx} className="border-b border-terminal-black last:border-0 hover:bg-phosphor-green/10">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-3 border-r border-terminal-black last:border-0 font-semibold leading-relaxed">{parseInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Markdown Renderer
const renderMarkdown = (mdText) => {
  if (!mdText) return null;
  const parts = mdText.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, idx) => {
    if (part.startsWith('```')) {
      const lines = part.split('\n');
      const firstLine = lines[0].replace('```', '').trim();
      const lang = firstLine.split(' ')[0] || '';
      const code = lines.slice(1, -1).join('\n');
      
      return (
        <div key={idx} className="my-4 border border-terminal-black font-mono text-sm overflow-hidden brutalist-shadow">
          <div className="bg-terminal-black text-phosphor-green px-4 py-1.5 text-xs font-bold uppercase select-none flex justify-between items-center">
            <span>CODE: {lang || 'TEXT'}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(code);
                alert("Code snippet copied to clipboard.");
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              [ COPY ]
            </button>
          </div>
          <pre className="bg-black text-[#00ff00] p-4 overflow-x-auto select-text leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      );
    } else {
      const lines = part.split('\n');
      let inList = false;
      let listItems = [];
      const renderedLines = [];
      
      const flushList = (key) => {
        if (listItems.length > 0) {
          renderedLines.push(
            <ul key={key} className="list-disc pl-6 my-3 font-sans font-semibold text-base leading-relaxed flex flex-col gap-1.5">
              {listItems.map((item, i) => (
                <li key={i} className="select-text">{parseInline(item)}</li>
              ))}
            </ul>
          );
          listItems = [];
          inList = false;
        }
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.startsWith('### ')) {
          flushList(`list-before-h3-${i}`);
          renderedLines.push(
            <h4 key={`h3-${i}`} className="font-mono text-lg font-black uppercase tracking-wider mt-5 mb-2 border-b border-terminal-black/15 pb-0.5 select-text">
              {parseInline(line.replace('### ', ''))}
            </h4>
          );
        } else if (line.startsWith('## ')) {
          flushList(`list-before-h2-${i}`);
          renderedLines.push(
            <h3 key={`h2-${i}`} className="font-mono text-xl font-black uppercase tracking-wider mt-6 mb-3 border-b border-terminal-black/25 pb-1 select-text">
              {parseInline(line.replace('## ', ''))}
            </h3>
          );
        } else if (line.startsWith('# ')) {
          flushList(`list-before-h1-${i}`);
          renderedLines.push(
            <h2 key={`h1-${i}`} className="font-mono text-2xl font-black uppercase tracking-wider mt-8 mb-4 border-b border-terminal-black pb-1.5 select-text">
              {parseInline(line.replace('# ', ''))}
            </h2>
          );
        } else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          inList = true;
          listItems.push(line.trim().substring(2));
        } else if (line.trim().startsWith('|')) {
          flushList(`list-before-table-${i}`);
          const tableRows = [];
          let j = i;
          while (j < lines.length && lines[j].trim().startsWith('|')) {
            tableRows.push(lines[j].trim());
            j++;
          }
          i = j - 1;
          if (tableRows.length > 1) {
            renderedLines.push(renderTable(tableRows, `table-${i}`));
          }
        } else if (line.trim() === '***' || line.trim() === '---') {
          flushList(`list-before-hr-${i}`);
          renderedLines.push(<hr key={`hr-${i}`} className="my-6 border-terminal-black/30" />);
        } else {
          if (line.trim() === '') {
            flushList(`list-before-break-${i}`);
          } else {
            if (inList) {
              listItems.push(line.trim());
            } else {
              renderedLines.push(
                <p key={`p-${i}`} className="font-sans text-base leading-relaxed text-terminal-black/90 font-semibold my-3 select-text">
                  {parseInline(line)}
                </p>
              );
            }
          }
        }
      }
      
      flushList(`list-end-${idx}`);
      return renderedLines;
    }
  });
};

export default function DocsView({ onBack }) {
  const [chapters, setChapters] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('/assets/bullos_docs.md');
        if (!res.ok) throw new Error("Docs load failed");
        const text = await res.text();
        
        const lines = text.split('\n');
        let inCodeBlock = false;
        const parsedChapters = [];
        let currentChapter = { title: "INTRODUCTION", content: [] };
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            currentChapter.content.push(line);
            continue;
          }
          
          if (!inCodeBlock && line.startsWith('# ')) {
            if (currentChapter.content.length > 0 || currentChapter.title !== "INTRODUCTION") {
              const rawContent = currentChapter.content.join('\n');
              const hasText = /[a-zA-Z0-9]/.test(rawContent);
              const cleanTitle = currentChapter.title.trim();
              if (hasText && cleanTitle && cleanTitle.toLowerCase() !== 'null') {
                parsedChapters.push({
                  title: cleanTitle,
                  content: rawContent
                });
              }
            }
            currentChapter = {
              title: line.replace('# ', '').trim(),
              content: []
            };
          } else {
            currentChapter.content.push(line);
          }
        }
        
        if (currentChapter.content.length > 0) {
          const rawContent = currentChapter.content.join('\n');
          const hasText = /[a-zA-Z0-9]/.test(rawContent);
          const cleanTitle = currentChapter.title.trim();
          if (hasText && cleanTitle && cleanTitle.toLowerCase() !== 'null') {
            parsedChapters.push({
              title: cleanTitle,
              content: rawContent
            });
          }
        }
        
        setChapters(parsedChapters);
        setLoading(false);
      } catch (err) {
        console.error("Error loading docs:", err);
        setLoading(false);
      }
    };
    
    fetchDocs();
  }, []);

  // Scroll main content to top on chapter change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [selectedIdx]);

  const filteredChapters = chapters.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChapter = filteredChapters[selectedIdx] || filteredChapters[0] || null;

  return (
    <div className="min-h-screen bg-phosphor-green text-terminal-black flex flex-col box-border font-sans select-none">
      
      {/* Editorial Header */}
      <header className="brutalist-border-thick bg-terminal-black text-phosphor-green py-3 px-6 flex justify-between items-center brutalist-shadow select-none">
        <div className="flex items-center gap-4">
          <span className="font-mono text-3xl font-black tracking-tighter">
            b[OS]
          </span>
          <span className="font-mono text-sm font-bold uppercase text-white tracking-widest hidden sm:inline">
            // DEVELOPER_DOCUMENTATION_PORTAL
          </span>
        </div>
        <button 
          onClick={onBack}
          className="px-5 py-2 border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all cursor-pointer font-mono text-sm font-bold uppercase"
        >
          [ RETURN TO TERMINAL ]
        </button>
      </header>

      {/* Loading State */}
      {loading ? (
        <div className="flex-1 flex flex-col justify-center items-center gap-3 font-mono text-lg font-bold">
          <span className="animate-pulse">STREAMING DOCUMENTATION DATABASE...</span>
          <div className="w-64 bg-black/10 border border-terminal-black h-4 relative">
            <div className="absolute inset-y-0 left-0 bg-terminal-black animate-[pulse_1.5s_infinite]" style={{ width: '70%' }}></div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row items-stretch box-border overflow-hidden">
          
          {/* Left Sidebar - Navigation & Search */}
          <aside className="w-full md:w-[320px] shrink-0 border-b md:border-b-0 md:border-r border-terminal-black bg-phosphor-green/10 flex flex-col md:h-[calc(100vh-68px)]">
            {/* Mobile Dropdown selector - hidden on desktop */}
            <div className="p-4 md:hidden border-b border-terminal-black/30 bg-phosphor-green/5">
              <label className="font-mono text-xs font-bold uppercase block mb-1 text-terminal-black/75">
                SELECT CHAPTER:
              </label>
              <select
                value={activeChapter ? activeChapter.title : ''}
                onChange={(e) => {
                  const selectedTitle = e.target.value;
                  const idx = filteredChapters.findIndex(c => c.title === selectedTitle);
                  if (idx !== -1) {
                    setSelectedIdx(idx);
                  }
                }}
                className="w-full bg-phosphor-green border border-terminal-black p-3 font-mono text-sm font-bold text-terminal-black uppercase focus:outline-none"
              >
                {filteredChapters.map((ch, idx) => (
                  <option key={idx} value={ch.title}>
                    {ch.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Navigation list - hidden on mobile */}
            <div className="hidden md:flex flex-col flex-1 overflow-hidden">
              {/* Search Box */}
              <div className="p-4 border-b border-terminal-black/30 bg-phosphor-green/5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIdx(0);
                  }}
                  placeholder="SEARCH DOCUMENTATION..."
                  className="w-full bg-black/5 border border-terminal-black p-3 font-mono text-xs text-terminal-black placeholder-terminal-black/45 focus:outline-none focus:bg-terminal-black focus:text-phosphor-green font-bold uppercase"
                />
                <span className="text-[9px] font-mono text-terminal-black/55 mt-2 block font-extrabold">
                  FOUND {filteredChapters.length} SECTIONS
                </span>
              </div>

              {/* Chapters list */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {filteredChapters.map((ch, idx) => {
                  const isSelected = activeChapter && ch.title === activeChapter.title;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const actualIdx = filteredChapters.findIndex(c => c.title === ch.title);
                        setSelectedIdx(actualIdx);
                      }}
                      className={`w-full text-left p-3 border font-mono text-sm transition-all flex flex-col justify-between cursor-pointer min-h-[50px] brutalist-shadow ${
                        isSelected 
                          ? 'bg-terminal-black text-phosphor-green border-terminal-black font-bold' 
                          : 'bg-phosphor-green text-terminal-black border-terminal-black hover:bg-terminal-black hover:text-phosphor-green hover:shadow-none'
                      }`}
                    >
                      <span className="truncate uppercase font-bold">{ch.title}</span>
                    </button>
                  );
                })}
                {filteredChapters.length === 0 && (
                  <div className="text-center py-10 font-mono text-xs text-terminal-black/55 italic font-bold">
                    NO MATCHING DOCUMENTATION SECTIONS FOUND.
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right Content - Markdown Document Viewer */}
          <main 
            ref={contentRef}
            className="flex-1 p-6 md:p-10 overflow-y-auto bg-phosphor-green/5 h-[calc(100vh-180px)] md:h-[calc(100vh-68px)]"
          >
            {activeChapter ? (
              <article className="max-w-4xl mx-auto flex flex-col gap-4">
                <h1 className="font-mono text-3xl md:text-4xl font-black uppercase tracking-wider border-b-2 border-terminal-black pb-4 mb-4 select-text">
                  {activeChapter.title}
                </h1>
                
                <div className="markdown-body select-text">
                  {renderMarkdown(activeChapter.content)}
                </div>
              </article>
            ) : (
              <div className="flex flex-col justify-center items-center h-full font-mono text-terminal-black/60 italic text-sm font-bold">
                SELECT A CHAPTER FROM THE SIDEBAR TO BEGIN.
              </div>
            )}
          </main>

        </div>
      )}

    </div>
  );
}
