import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const SignIn = lazy(() => import('../pages/SignIn'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ChangePassword = lazy(() => import('../pages/ChangePassword'));
const LinkExpired = lazy(() => import('../pages/LinkedExpired'));
const Register = lazy(() => import('../pages/Register'));
const AccountVerified = lazy(() => import('../pages/AccountVerified'));
const ContactUser = lazy(() => import('../pages/ContacUs'));
const AuthRequired = lazy(() => import('../pages/AuthRequired'));
const UnderConstruction = lazy(() => import('../pages/UnderConstruction'));
const Lakes = lazy(() => import('../components/admin/Lakes'));
const Parameters = lazy(() => import('../components/admin/Parameters'));
const Measurements = lazy(() => import('../components/admin/Measurements'));
const ImportExcel = lazy(() => import('../components/admin/ImportExcel'));
const Repositories = lazy(() => import('../pages/Repositories'));
const MainDataPage = lazy(() => import('../pages/MainDataPage'));
const LakeDataDashboardPage = lazy(() => import('../pages/LakeDataDashboard'));
const Dashboard = lazy(() => import('../components/admin/Dashboard'));
const AuditPage = lazy(() => import('../components/admin/Audit'));
const EmailSender = lazy(() => import('../components/admin/EmailSender'));

export const routes = {
    public: [
        { path: '/', component: Home },
        { path: '/sign-in', component: SignIn },
        { path: '/forgot-password', component: ForgotPassword },
        { path: '/change-password/:token', component: ChangePassword },
        { path: '/link-expired', component: LinkExpired },
        { path: '/sign-up', component: Register },
        { path: '/account-verified/:token', component: AccountVerified },
        { path: '/contact-us', component: ContactUser },
        { path: '/auth-required', component: AuthRequired },
        { path: '/concept', component: UnderConstruction },
        { path: '/activities', component: UnderConstruction },
        { path: '/news', component: UnderConstruction },
    ],
    private: {
        admin: [
            { path: '/admin/dashboard', component: Dashboard },
            { path: '/admin/manage-data/lakes', component: Lakes },
            { path: '/admin/manage-data/parameters', component: Parameters },
            { path: '/admin/manage-data/measurements', component: Measurements },
            { path: '/admin/upload-data', component: ImportExcel },
            { path: '/admin/activity-log', component: AuditPage },
            { path: '/admin/settings/email-sender', component: EmailSender },
        ],
        user: [
            { path: '/data', component: MainDataPage },
            { path: '/data/repositories', component: Repositories },
            { path: '/data/repositories/:id', component: LakeDataDashboardPage },
            { path: '/profile', component: UnderConstruction },
        ],
    },
};

export const isPublicRoute = (path) => {
    return routes.public.some(route => {
        if (typeof route.path === 'string') {
            return route.path === path;
        }
        return new RegExp(route.path).test(path);
    });
};

export const routeExists = (path) => {
    const allRoutes = [
        ...routes.public,
        ...routes.private.admin,
        ...routes.private.user,
    ];
    return allRoutes.some(route => {
        if (typeof route.path === 'string') {
            return route.path === path;
        }
        return new RegExp(route.path).test(path);
    });
};