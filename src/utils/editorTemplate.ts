/**
 * 获取完整的编辑器 HTML 模板
 * 从原始的 editor.html 中提取并整理
 */

export function getFullEditorHTML(): string {
  // 由于内容太长，我们将从 public/editor.html 动态加载
  // 这里返回一个占位符，实际使用时会通过 fetch 加载
  return '';
}

/**
 * 异步加载编辑器 HTML 模板
 */
export async function loadEditorHTML(): Promise<string> {
  try {
    const response = await fetch('/editor.html');
    const html = await response.text();
    
    // 提取 body 中的内容（去掉 script 标签）
    const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
    if (bodyMatch) {
      let content = bodyMatch[1];
      
      // 移除 script 标签（这些会在 React 组件中单独加载）
      content = content.replace(/<script[\s\S]*?<\/script>/g, '');
      
      return content;
    }
    
    return '';
  } catch (error) {
    console.error('Failed to load editor HTML:', error);
    return '';
  }
}

/**
 * 异步加载移动端编辑器 HTML 模板
 */
export async function loadMobileEditorHTML(): Promise<string> {
  try {
    const response = await fetch('/editor-mobile.html');
    const html = await response.text();
    
    const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
    if (bodyMatch) {
      let content = bodyMatch[1];
      content = content.replace(/<script[\s\S]*?<\/script>/g, '');
      return content;
    }
    
    return '';
  } catch (error) {
    console.error('Failed to load mobile editor HTML:', error);
    return '';
  }
}
