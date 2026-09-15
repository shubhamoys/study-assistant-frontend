import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { resolveAssetUrl } from "@/lib/asset-url";
import styles from "./markdown-content.module.scss";

// Markdown image syntax stores the relative path the upload API returned
// (e.g. "/uploads/attachments/x.png") — the backend serves it from its own
// origin, so every rendered <img> needs the same resolution avatars/deck
// covers already go through, not just a plain src passthrough.
const components: Components = {
  img: ({ src, alt }) => {
    const resolved =
      typeof src === "string" ? (resolveAssetUrl(src) ?? src) : src;
    // eslint-disable-next-line @next/next/no-img-element -- backend-origin URL, not a Next/Image candidate (same reasoning as Avatar).
    return <img src={resolved} alt={alt ?? ""} />;
  },
};

interface MarkdownContentProps {
  children: string;
  className?: string;
}

/**
 * The single rendering path for every piece of user-authored markdown in the
 * app (flashcard front/back, deck descriptions) — used both for the editor's
 * own live-preview pane and for final read-only display, rather than
 * trusting a third-party editor's built-in (unsanitized) preview. `rehype-sanitize`
 * runs before `rehype-highlight` deliberately: sanitizing strips any
 * injected script/event-handler HTML from the *user's* markdown first, then
 * highlighting — a trusted transform this app applies itself — adds its own
 * `hljs-*` classes afterward, so they're never at risk of being stripped.
 */
export function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div className={`${styles.content} ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
