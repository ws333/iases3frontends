import { TFaxComponent } from '../types/types';

type Props = {
  Component: TFaxComponent;
  name: string;
};

function FaxPreview({ name, Component }: Props) {
  return (
    <div>
      <div className="fax_preview_content">
        <Component name={name} />
      </div>
    </div>
  );
}

export default FaxPreview;
