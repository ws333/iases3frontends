/**
 * Modified copy (imports) of IconIFO.tsx from addon interface
 */
import { CSSProperties } from 'react';
import { IASE_URL } from '../../../../addon/packages/interface/src/constants/constants';
import '../../../../addon/packages/interface/src/components/IconIFO.css';
import icon from '../../../../addon/packages/thunderbird-extension/public/skin/icon64.png';

type Props = {
  isHovering?: boolean;
  onImageLoad?: () => void;
};

function IconIFO({ isHovering = true, onImageLoad }: Props) {
  return (
    <a href={IASE_URL} target="_blank" rel="noopener noreferrer">
      <img
        className={`icon_ifo ${isHovering ? 'hovering_ifo' : ''}`}
        style={iconStyles}
        src={icon}
        alt="Interstellar Alliance Social Experiment Step 3 icon"
        onLoad={onImageLoad}
      />
    </a>
  );
}
export default IconIFO;

export const iconSize = 70;

const iconStyles: CSSProperties = {
  width: iconSize,
  height: iconSize,
  // Prevent layout shift during image loading
  minWidth: iconSize,
  minHeight: iconSize,
  // Ensure consistent sizing regardless of image load state
  objectFit: 'contain',
  display: 'block',
};
