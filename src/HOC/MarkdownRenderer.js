import React from 'react';
import 'cdmd-editor/dist/index.css';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github.css';
import MarkdownIt from 'markdown-it';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';

const md = new MarkdownIt({
    breaks: true,
    linkify: true,
    highlight: function (code, lang) {
        try {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        } catch (__) {}
        return '';
    }
});

md.linkify.set({ fuzzyEmail: false });

// Instead of import can also be used as
// md.use(require('markdown-it-sub'));
md.use(markdownItSub);
md.use(markdownItSup);

const MarkdownRenderer = props => (
    <div
        className={props.className}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md.render(props.content)) }}
    />
);

export default MarkdownRenderer;
