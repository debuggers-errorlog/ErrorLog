import MarkdownIt from 'markdown-it';
import { normalizeMarkdownImages } from './imageUrl';

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

const defaultImageRender = mdParser.renderer.rules.image
  ?? ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

mdParser.renderer.rules.image = (tokens, idx, options, env, self) => {
  const src = tokens[idx].attrGet('src');
  if (!src || !src.trim()) {
    const alt = tokens[idx].content || 'image';
    return `<p class="md-image-missing">[image: ${alt}]</p>`;
  }
  return defaultImageRender(tokens, idx, options, env, self);
};

export function renderMarkdown(text) {
  return mdParser.render(normalizeMarkdownImages(text ?? ''));
}
