// Document Picture-in-Picture: the only web API that keeps a window above every
// other app, Meet, Teams or Zoom included. Chrome and Edge desktop only.

type PipApi = {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
};

// Typed locally: the TypeScript DOM lib may not ship this API yet.
const api = (window as unknown as { documentPictureInPicture?: PipApi }).documentPictureInPicture;

export const pipSupported = api !== undefined;

/**
 * Moves `content` into a floating window. When that window closes, whether the
 * user closed it or another site (such as Meet) opened its own, `onClose` runs
 * so the caller can take the content back.
 * Must be called from a click: browsers require a user gesture.
 */
export async function openPip(content: HTMLElement, onClose: () => void): Promise<Window> {
  if (!api) throw new Error('Document Picture-in-Picture is not supported');
  const pip = await api.requestWindow({ width: 300, height: 250 });
  copyStyles(pip.document);
  pip.document.title = document.title;
  pip.document.body.classList.add('pip');
  pip.document.body.append(content);
  pip.addEventListener('pagehide', onClose, { once: true });
  return pip;
}

function copyStyles(target: Document) {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const style = target.createElement('style');
      style.textContent = Array.from(sheet.cssRules, (rule) => rule.cssText).join('\n');
      target.head.append(style);
    } catch {
      if (!sheet.href) continue;
      const link = target.createElement('link');
      link.rel = 'stylesheet';
      link.href = sheet.href;
      target.head.append(link);
    }
  }
}
