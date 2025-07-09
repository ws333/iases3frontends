// Example usage in webapp/frontend/src/components/ExampleUsage.tsx

// Basic import syntax for when shared components are ready:

// 1. Import specific components
// import { Header, EmailPreview } from '@iases3/shared-ui/components';

// 2. Import hooks
// import { useContactList, useEmailOptions } from '@iases3/shared-ui/hooks';

// 3. Import types
// import { ContactI3C, Email } from '@iases3/shared-ui/types';

// 4. Import constants
// import { DEFAULT_DELAY, EMAIL_TEMPLATES } from '@iases3/shared-ui/constants';

// 5. Import helpers
// import { validateEmail, waitRandomSeconds } from '@iases3/shared-ui/helpers';

// Example component using shared UI:
/*
function ExampleComponent() {
  const { contacts, emailsSent } = useContactList();
  
  return (
    <div>
      <Header />
      <EmailPreview Component={EmailComponent} name="John Doe" />
      <p>Emails sent: {emailsSent}</p>
    </div>
  );
}
*/

export {};
