export default function container_plugin(md, name, options) {
    function validateDefault(params) {
        if (!validTags.includes(tag)) {
            return false;
        }
        return params.trim().split(' ', 2)[0] === name;
    }

    function renderDefault(tokens, idx, _options, env, slf) {
        const token = tokens[idx];
        return `<tag class=${name}>${token.content}</tag>`;
    }

    options = options || {};

    var min_markers = 3,
        marker_str = options.marker || ':',
        marker_char = marker_str.charCodeAt(0),
        marker_len = marker_str.length,
        validate = options.validate || validateDefault,
        render = options.render || renderDefault,
        tag = options.tag || 'p',
        validTags = options.validTags || ['p', 'div'];

    function container(state, startLine, endLine, silent) {
        var pos,
            nextLine,
            marker_count,
            markup,
            params,
            token,
            old_line_max,
            auto_closed = false,
            start = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];

        // Check out the first character quickly,
        // this should filter out most of non-containers
        //
        if (marker_char !== state.src.charCodeAt(start)) {
            return false;
        }

        // Check out the rest of the marker string
        //
        for (pos = start + 1; pos <= max; pos++) {
            if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
                break;
            }
        }

        marker_count = Math.floor((pos - start) / marker_len);
        if (marker_count < min_markers) {
            return false;
        }
        pos -= (pos - start) % marker_len;

        markup = state.src.slice(start, pos);
        params = state.src.slice(pos, max);
        if (!validate(params, markup)) {
            return false;
        }

        // Since start is found, we can report success here in validation mode
        //
        if (silent) {
            return true;
        }

        // Search for the end of the block
        //
        nextLine = startLine;

        for (;;) {
            nextLine++;
            if (nextLine >= endLine) {
                // unclosed block should be autoclosed by end of document.
                // also block seems to be autoclosed by end of parent
                break;
            }

            start = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];

            if (start < max && state.sCount[nextLine] < state.blkIndent) {
                // non-empty line with negative indent should stop the list:
                // - ```
                //  test
                break;
            }

            if (marker_char !== state.src.charCodeAt(start)) {
                continue;
            }

            if (state.sCount[nextLine] - state.blkIndent >= 4) {
                // closing fence should be indented less than 4 spaces
                continue;
            }

            for (pos = start + 1; pos <= max; pos++) {
                if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
                    break;
                }
            }

            // closing code fence must be at least as long as the opening one
            if (Math.floor((pos - start) / marker_len) < marker_count) {
                continue;
            }

            // make sure tail has spaces only
            pos -= (pos - start) % marker_len;
            pos = state.skipSpaces(pos);

            if (pos < max) {
                continue;
            }

            // found!
            auto_closed = true;
            break;
        }

        old_line_max = state.lineMax;
        let len = state.sCount[startLine];

        // this will prevent lazy continuations from ever going past our end marker
        state.lineMax = nextLine;

        token = state.push('cd_custom' + name, tag, 0);
        token.markup = markup;
        token.info = params;
        token.content = state.getLines(startLine + 1, nextLine, len, true);
        token.map = [startLine, nextLine];
        token.markup = state.src.slice(start, pos);
        state.lineMax = old_line_max;
        state.line = nextLine + (auto_closed ? 1 : 0);

        return true;
    }

    md.block.ruler.before('fence', 'cd_custom' + name, container, {
        alt: ['paragraph', 'reference', 'blockquote', 'list']
    });
    md.renderer.rules['cd_custom' + name] = render;
    md.renderer.rules['cd_custom' + name] = render;
}
