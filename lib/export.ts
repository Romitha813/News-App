import { SearchResponse } from '@/types';

export function downloadAsMarkdown(query: string, data: SearchResponse) {
  let md = `# Search Results: "${query}"\n\n`;
  md += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  if (data.reliable.length > 0) {
    md += `## ✅ Reliable Sources (${data.reliable.length})\n\n`;
    data.reliable.forEach(item => {
      md += `### [${item.title}](${item.url})\n`;
      md += `- **Source:** ${item.domain} (Score: ${item.reliabilityScore.toFixed(1)})\n`;
      md += `- **Date:** ${new Date(item.publishedAt).toLocaleDateString()}\n`;
      md += `- **Snippet:** ${item.description}\n\n`;
    });
  }
  
  if (data.unreliable.length > 0) {
    md += `## ⚠️ Unreliable Sources (${data.unreliable.length})\n\n`;
    data.unreliable.forEach(item => {
      md += `### [${item.title}](${item.url})\n`;
      md += `- **Source:** ${item.domain} (Score: ${item.reliabilityScore.toFixed(1)})\n`;
      md += `- **Date:** ${new Date(item.publishedAt).toLocaleDateString()}\n`;
      md += `- **Snippet:** ${item.description}\n\n`;
    });
  }
  
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `news_analyzer_${query.replace(/\s+/g, '_')}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAsPDF() {
  // Utilizing browser print to PDF capabilities for simplest export
  window.print();
}
