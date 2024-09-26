import Layout from "../components/common/Layout";
import AuthRequired from '../components/common/AuthRequired';

const AuthRequiredPage = () => {
    return (
        <Layout>
            <AuthRequired />
        </Layout>
    );
}

export default AuthRequiredPage