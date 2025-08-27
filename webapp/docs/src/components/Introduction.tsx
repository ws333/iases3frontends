import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { processMarkdown } from '../helpers/markdownProcessor';
import introductionMarkdown from '../md/introduction.md?raw';

function Introduction() {
  const processedMarkdown = processMarkdown(introductionMarkdown, '{{URL_WEBAPP}}');

  return (
    <div className="docs-container xsmaller-vertical-margins">
      <div className="docs-markdown">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{processedMarkdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default Introduction;
