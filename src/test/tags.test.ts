import { test } from 'node:test';
import assert from 'node:assert/strict';
import MarkdownIt from 'markdown-it';
import { tagsPlugin, generateTagSpan } from '../tags';

const render = (src: string) => new MarkdownIt({ html: true }).use(tagsPlugin).render(src).trim();

test('renders a basic tag with both separators', () => {
    assert.equal(render('((tag|done))'), '<p><span class="bn-tags done">done</span></p>');
    assert.equal(render('((tag/done))'), '<p><span class="bn-tags done">done</span></p>');
});

test('unknown labels fall back to grey', () => {
    assert.match(render('((tag|whatever))'), /class="bn-tags grey"/);
});

test('explicit named color wins over the label color', () => {
    assert.match(render('((tag|warn|blue))'), /class="bn-tags blue"/);
});

test('upper-case labels keep the bn-upper class even with an explicit color', () => {
    assert.match(render('((tag|tbd|red))'), /class="bn-tags red bn-upper"/);
});

test('hex colors are passed as CSS variables, including for arrow tags', () => {
    assert.equal(
        render('((<tag|next|#ff4500|#fff))'),
        '<p><span class="bn-tags bn-arrow-tags" style="--bn-bg: #ff4500; --bn-fg: #fff">next</span></p>'
    );
});

test('invalid colors are ignored', () => {
    const html = generateTagSpan('x', 'url(javascript:alert(1))', '"><script>');
    assert.equal(html, '<span class="bn-tags grey">x</span>');
});

test('named foreground colors are not supported and are ignored', () => {
    assert.doesNotMatch(render('((tag|x|red|red))'), /style=/);
});

test('label is escaped', () => {
    assert.equal(generateTagSpan('<b>&"\'', 'red'), '<span class="bn-tags red">&lt;b&gt;&amp;&quot;&#39;</span>');
});

test('text around a tag is escaped', () => {
    const html = render('&lt;img src=x onerror=alert(1)&gt; ((tag|done)) a & b');
    assert.ok(!html.includes('<img'), html);
    assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'), html);
    assert.ok(html.includes('a &amp; b'), html);
});

test('text without tags is rendered by the default renderer', () => {
    assert.equal(render('a < b & c'), '<p>a &lt; b &amp; c</p>');
});

test('multiple tags in one line, and tags in headings and code', () => {
    const html = render('# T ((tag|done))\n\n((tag|a)) ((tag|b))\n\n`((tag|code))`');
    assert.equal(html.match(/bn-tags/g)?.length, 3);
    assert.ok(html.includes('<code>((tag|code))</code>'), html);
});
