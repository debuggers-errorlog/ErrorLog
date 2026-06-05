import styled from 'styled-components';

export const EditorWrapper = styled.div`
  margin-bottom: 16px;

  .rc-md-editor {
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.lg};
    background: ${({ theme }) => theme.colors.surface};
    font-family: ${({ theme }) => theme.font.sans};
  }

  .rc-md-navigation {
    background: ${({ theme }) => theme.colors.bgElevated};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  .rc-md-navigation .button-wrap .button {
    color: ${({ theme }) => theme.colors.textSecondary};

    &:hover {
      color: ${({ theme }) => theme.colors.text};
      background: ${({ theme }) => theme.colors.surfaceHover};
    }
  }

  .rc-md-navigation .button-wrap .button.disabled {
    opacity: 0.35;
  }

  .rc-md-editor .editor-container > .section {
    border-right: 1px solid ${({ theme }) => theme.colors.border};
  }

  .rc-md-editor .editor-container .sec-md .input {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    font-size: 15px;
    line-height: 1.7;
    font-family: ${({ theme }) => theme.font.mono};
  }

  .rc-md-editor .editor-container .sec-html .html-wrap {
    background: ${({ theme }) => theme.colors.bgElevated};
    color: ${({ theme }) => theme.colors.text};
    font-size: 15px;
    line-height: 1.7;
  }

  .rc-md-editor .editor-container .sec-html .html-wrap,
  .rc-md-editor .custom-html-style {
    padding: 16px;
  }

  .custom-html-style {
    color: ${({ theme }) => theme.colors.text};

    h1,
    h2,
    h3,
    h4 {
      color: ${({ theme }) => theme.colors.text};
      margin: 1.2em 0 0.6em;
    }

    p {
      margin: 0.75em 0;
    }

    a {
      color: ${({ theme }) => theme.colors.accent};
    }

    code {
      background: ${({ theme }) => theme.colors.bg};
      padding: 2px 6px;
      border-radius: 4px;
      font-family: ${({ theme }) => theme.font.mono};
      font-size: 0.9em;
    }

    pre {
      background: ${({ theme }) => theme.colors.bg};
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-radius: ${({ theme }) => theme.radius.md};
      padding: 14px;
      overflow-x: auto;

      code {
        background: transparent;
        padding: 0;
      }
    }

    blockquote {
      border-left: 3px solid ${({ theme }) => theme.colors.accent};
      margin: 1em 0;
      padding: 0.25em 0 0.25em 1em;
      color: ${({ theme }) => theme.colors.textSecondary};
    }

    img {
      max-width: 100%;
      border-radius: ${({ theme }) => theme.radius.md};
    }

    ul,
    ol {
      padding-left: 1.5em;
    }
  }
`;
