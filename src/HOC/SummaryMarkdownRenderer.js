import React from 'react';
import 'cdmd-editor/dist/index.css';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/atom-one-dark.css';
import MarkdownIt from 'markdown-it';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';
import mark from 'markdown-it-mark';
import mdAttr from 'markdown-it-attrs';
import mdTable from 'markdown-it-multimd-table';
import mdFigure from 'markdown-it-figure';
import customElement from '../Utils/MarkdownItPlugins/customElement';
import { summaryCodeChange } from '../Utils/summaryCodeChange';

const md = new MarkdownIt({
    breaks: true,
    highlight: function (code, lang) {
        try {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        } catch (__) {}
        return '';
    }
});

md.use(markdownItSub);
md.use(markdownItSup);
md.use(mark);
md.use(mdFigure);
md.use(mdTable, { headerless: true, multiline: true, rowspan: true });
md.use(mdAttr, { allowedAttributes: ['class'] });
md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
    const token = tokens[idx];
    let info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    let langName = '';
    let highlighted = '';
    let langAttrs = '';
    let arr;
    if (info) {
        arr = info.split(/(\s+)/g);
        langName = arr[0];
        langAttrs = arr.slice(2).join('');
    }
    if (options.highlight) {
        highlighted = options.highlight(token.content, langName, langAttrs) || md.utils.escapeHtml(token.content);
    } else {
        highlighted = md.utils.escapeHtml(token.content);
    }
    if (highlighted.indexOf('<pre') === 0) {
        return highlighted + '\n';
    }
    return `<pre ${slf.renderAttrs(token)}><code class=${options.langPrefix}${langName}>${highlighted}</code></pre>`;
};
md.use(customElement, 'file', {
    validate: function (params) {
        const paramsList = params.trim().split(' ', 2);
        if (paramsList[1]) {
            return paramsList[0] === 'file';
        }
        return false;
    },
    render: function (tokens, idx) {
        const token = tokens[idx];
        const secondParam = token.info.trim().split(' ', 2)[1];
        return `<div class='file-wrapper'><p class='p-filename'>${secondParam}</p><div class='div-file'>${token.content}</div></div>`;
    }
});

md.use(customElement, 'multiple-code', {
    validate: function (params) {
        const paramsList = params.trim().split(' ', 2);
        if (paramsList[1]) {
            return paramsList[0] === 'multiple-code';
        }
        return false;
    },
    render: function (tokens, idx) {
        const token = tokens[idx];
        const secondParam = token.info.trim().split(' ', 2)[1];
        const langList = secondParam.trim().split(',');
        let ulElement = langList.map((langName, index) => {
            if (index === 0) {
                return `<li class="active-tab">${langName}</li>`;
            }
            return `<li>${langName}</li>`;
        });
        ulElement = `<ul>${ulElement.join('')}</ul>`;
        let codes = token.content.match(/^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm);
        codes = codes.join('\n\n');
        codes = md.render(codes);
        if (codes.substring(0, 4) === '<pre') {
            codes = "<pre class='active-code' " + codes.substring(4);
        }
        return `<div class='code-multiple-lang'>${ulElement}${codes}</div>`;
    }
});

const SummaryMarkdownRenderer = props => (
    <div
        onClick={summaryCodeChange}
        className={props.className}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md.render(props.content)) }}
    />
);

export default SummaryMarkdownRenderer;
