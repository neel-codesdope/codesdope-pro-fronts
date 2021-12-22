import React from 'react';
import 'cdmd-editor/dist/index.css';
import DOMPurify from 'dompurify';

import MarkdownIt from 'markdown-it';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';

const md = new MarkdownIt({
    breaks: true,
    linkify: true
});

md.linkify.set({ fuzzyEmail: false });

md.use(markdownItSub);
md.use(markdownItSup);
md.disable('image');

const CommentMarkdownRenderer = props => (
    <div
        className={props.className}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md.renderInline(props.content)) }}
    />
);

export default CommentMarkdownRenderer;
