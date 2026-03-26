import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BottomNav } from './components/Shared/Navigation'
import { AuthProvider } from './contexts/AuthContext'
import { CommunityPage } from './pages/Community/view/CommunityPage'
import { CreatePostPage } from './pages/Community/view/CreatePostPage'
import { DetailPage } from './pages/DetailPage'
import { HomePage } from './pages/Home/HomePage'
import { LoginPage } from './pages/MyPage/view/LoginPage'
import { MyPage } from './pages/MyPage/view/MyPage'
import { SignupPage } from './pages/MyPage/view/SignupPage'
import { ResultPage } from './pages/Test/view/ResultPage'
import { TestPage } from './pages/Test/view/TestPage'
export function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                {/* Mobile App Container Wrapper */}
                <div className="min-h-screen bg-gray-100 flex justify-center">
                    <div className="relative w-full max-w-md h-screen bg-background flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto pb-20 relative hide-scrollbar">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/test" element={<TestPage />} />
                                <Route path="/result/:type" element={<ResultPage />} />
                                <Route path="/place/:id" element={<DetailPage />} />
                                <Route path="/community" element={<CommunityPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupPage />} />
                                <Route path="/my" element={<MyPage />} />
                                <Route path="/create-post" element={<CreatePostPage />} />
                            </Routes>
                        </div>

                        {/* Bottom Navigation */}
                        <BottomNav />
                    </div>
                </div>
            </BrowserRouter>
        </AuthProvider>
    )
}
