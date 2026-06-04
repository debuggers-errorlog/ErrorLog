import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { GlobalStyle } from './theme/GlobalStyle';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import WritePostPage from './pages/WritePostPage';
import MyPage from './pages/MyPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/write" element={<WritePostPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
