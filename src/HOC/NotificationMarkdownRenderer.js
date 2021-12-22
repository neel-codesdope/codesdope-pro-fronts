import React from 'react';
import 'cdmd-editor/dist/index.css';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';

const md = new MarkdownIt({
    linkify: false
});

md.use(markdownItSub);
md.use(markdownItSup);
md.disable('image');
md.disable('link');

const NotificationMarkdownRenderer = props => {
    let content = !!props.content ? props.content : '';
    return (
        <div
            className={props.className}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md.renderInline(content)) }}
        />
    );
};

export default NotificationMarkdownRenderer;
