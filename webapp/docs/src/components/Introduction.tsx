import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import introductionMarkdown from '../md/introduction.md?raw';

function Introduction() {
  return (
    <div className="docs-container xsmaller-vertical-margins">
      <div className="docs-markdown">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{introductionMarkdown}</ReactMarkdown>
      </div>
    </div>
  );
}

export default Introduction;
