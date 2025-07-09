import { TestComponent } from '@iases3/shared-ui';
import React from 'react';

export const SharedUITest: React.FC = () => {
  return (
    <div>
      <h2>Testing Shared UI</h2>
      <TestComponent message="This component is loaded from the shared-ui workspace package!" />
    </div>
  );
};

export default SharedUITest;
