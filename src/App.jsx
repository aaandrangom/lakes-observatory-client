import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './components/common/Loading';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import PrivateRoutes from './context/PrivateRoutes';

const Home = lazy(() => import('./pages/Home'));
const Error404 = lazy(() => import('./pages/Error404'));
const SignIn = lazy(() => import('./pages/SignIn'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const LinkExpired = lazy(() => import('./pages/LinkedExpired'));
const Register = lazy(() => import('./pages/Register'));
const AccountVerified = lazy(() => import('./pages/AccountVerified'));
const Sidebar = lazy(() => import('./components/admin/Sidebar'));

const Content = lazy(() => import('./pages/Content'));
const Lakes = lazy(() => import('./components/admin/Lakes'));
const Parameters = lazy(() => import('./components/admin/Parameters'));
const Measurements = lazy(() => import('./components/admin/Measurements'));
const ImportExcel = lazy(() => import('./components/admin/ImportExcel'));
const Repositories = lazy(() => import('./pages/Repositories'));
const MainDataPage = lazy(() => import('./pages/MainDataPage'));
const LakeDataDashboardPage = lazy(() => import('./pages/LakeDataDashboard'));
const UnderConstruction = lazy(() => import('./pages/UnderConstruction'));
const ChatFloat = lazy(() => import('./components/common/ChatFloat'));
const Dashboard = lazy(() => import('./components/admin/Dashboard'));
const ContactUser = lazy(() => import('./pages/ContacUs'));
const AuthRequired = lazy(() => import('./pages/AuthRequired'));
const AuditPage = lazy(() => import('./components/admin/Audit'));
const EmailSender = lazy(() => import('./components/admin/EmailSender'));
const EmailTest = lazy(() => import('./components/admin/EmailTest'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/change-password/:token' element={<ChangePassword />} />
            <Route path='/link-expired' element={<LinkExpired />} />
            <Route path='/sign-up' element={<Register />} />
            <Route path='/account-verified/:token' element={<AccountVerified />} />

            <Route path='/contact-us' element={<ContactUser />} />
            <Route path='/auth-required' element={<AuthRequired />} />

            <Route path='/concept' element={<UnderConstruction />} />
            <Route path='/activities' element={<UnderConstruction />} />
            <Route path='/news' element={<UnderConstruction />} />

            <Route element={<Sidebar />}>
              <Route element={<PrivateRoutes requiredRoles={['admin']} />}>
                <Route path='/admin/dashboard' element={
                  <Content>
                    <Dashboard />
                  </Content>
                } />
                <Route path='/admin/manage-data/lakes' element={
                  <Content>
                    <Lakes />
                  </Content>
                } />
                <Route path='/admin/manage-data/parameters' element={
                  <Content>
                    <Parameters />
                  </Content>
                } />
                <Route path='/admin/manage-data/measurements' element={
                  <Content>
                    <Measurements />
                  </Content>
                } />
                <Route path='/admin/upload-data' element={
                  <Content>
                    <ImportExcel />
                  </Content>
                } />
                <Route path='/admin/activity-log' element={
                  <Content>
                    <AuditPage />
                  </Content>
                } />

                <Route path='/admin/settings/email-sender' element={
                  <Content>
                    <EmailSender />
                    <EmailTest />
                  </Content>
                } />
              </Route>
            </Route>

            <Route element={<PrivateRoutes requiredRoles={['admin', 'usuario']} />}>
              <Route path='/data' element={<MainDataPage />} />
              <Route path='/data/repositories' element={<Repositories />} />
              <Route path='/data/repositories/:id' element={<LakeDataDashboardPage />} />
              <Route path='/profile' element={<UnderConstruction />} />
            </Route>

            <Route path="*" element={<Error404 />} />
          </Routes>
        </Suspense>
      </AuthProvider>
      <ChatFloat />
      <Toaster richColors closeButton />
    </Router>
  );
}

export default App;
