import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Home from './pages/Home/Home';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard'
import PageNotFound from './PageNotFound';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import Sidebar from './components/Sidebars/Sidebar';
import Footer from './components/footer/Footer';
import ChatPage from './pages/Chat/ChatPage';
import { AuthProvider } from './context/AuthContext.jsx';
import AskQuestion from './pages/Questions/askQuestions.jsx';
import Question from './pages/Questions/Question.jsx';
import UserProfile from './pages/Profile/UserProfile.jsx'
import Landing from './pages/Landing/Landing.jsx';
import SingleQuestionPage from './pages/Questions/SingleQuestionPage.jsx';


function App() {

    const GoogleAuthWrapper = () => {

        return (
            <GoogleOAuthProvider clientId="638725912541-0khu27i2npsu8g9h5880otdcfstcjgs6.apps.googleusercontent.com">
                <GoogleLogin></GoogleLogin>
            </GoogleOAuthProvider>
        )
    }

    return (
        <AuthProvider>

            <BrowserRouter>
                <Routes>
                    <Route path='/goooglelogin' element={<GoogleLogin />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    {/* <Route path='*' element={<PageNotFound/>}/>  */}
                    <Route path='/sidebar' element={<Sidebar />} />
                    <Route path='/' element={<Home />} />
                    <Route path='/footer' element={<Footer />} />
                    <Route path='/chat' element={<ChatPage />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/askQuestion" element={<AskQuestion />} />
                    <Route path="/questions/:id" element={<Question />} />
                    <Route path="/questions" element={<Question />} />
                    <Route path="/questions/:id" element={<SingleQuestionPage />} />
                    <Route path="/userProfile" element={<UserProfile />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App;