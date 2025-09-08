import { JSX } from 'react';
import { store } from '../store/store';
import './Overlay.css';

interface Props {
  title: string;
  Component: (props?: Record<string, unknown>) => JSX.Element;
  closeOnClickBackground?: boolean;
  onClose?: () => void;
}

function Overlay({ title, Component, onClose, closeOnClickBackground }: Props) {
  const actions = store.getActions();

  const _onClose = () => {
    if (onClose) onClose();
    actions.fullPageOverlay.closeOverlay();
  };

  return (
    <div className="overlay" onClick={closeOnClickBackground ? onClose : () => {}}>
      <div className="modal">
        <button className="close-button" onClick={_onClose}>
          ×
        </button>
        <h2 className="overlay-title">{title}</h2>
        <Component />
      </div>
    </div>
  );
}

export default Overlay;
