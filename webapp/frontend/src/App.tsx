import { Route, Routes } from 'react-router-dom';
import EmailSender from './components/EmailSender';
import LogIn from './components/LogIn';
import Page404 from './components/Page404';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div>
      <Routes>
        <Route index element={<LogIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path="step3">
            <Route index element={<EmailSender />} />
          </Route>
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
