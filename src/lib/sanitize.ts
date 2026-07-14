import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'h1', 'h2', 'h3', 'h4',
  'ul', 'ol', 'li', 'a', 'blockquote', 'span', 'div',
];

const allowedAttributes = {
  a: ['href', 'title', 'rel', 'target'],
  '*': ['class'],
};

export function sanitizeBody(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'discard',
  });
}
