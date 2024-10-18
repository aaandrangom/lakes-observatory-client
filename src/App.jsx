import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './components/common/Loading';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import PrivateRoutes from './context/PrivateRoutes';
import { routes } from './config/routes';

const Sidebar = lazy(() => import('./components/admin/Sidebar'));
const Content = lazy(() => import('./pages/Content'));
const ChatFloat = lazy(() => import('./components/common/ChatFloat'));
const Error404 = lazy(() => import('./pages/Error404'));

function AppRoutes() {

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routes.public.map((route) => (
          <Route key={route.path} path={route.path} element={<route.component />} />
        ))}

        <Route element={<Sidebar />}>
          <Route element={<PrivateRoutes requiredRoles={['admin']} />}>
            {routes.private.admin.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Content>
                    <route.component />
                  </Content>
                }
              />
            ))}
          </Route>
        </Route>

        <Route element={<PrivateRoutes requiredRoles={['admin', 'usuario']} />}>
          {routes.private.user.map((route) => (
            <Route key={route.path} path={route.path} element={<route.component />} />
          ))}
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <ChatFloat />
      <Toaster richColors closeButton />
    </Router>
  );
}

export default App;
