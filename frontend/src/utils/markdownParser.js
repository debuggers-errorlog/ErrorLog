import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

export function renderMarkdown(text) {
  return mdParser.render(text ?? '');
}
