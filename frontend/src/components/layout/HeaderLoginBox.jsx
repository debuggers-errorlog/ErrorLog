import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../../api/auth';
import { saveTokens } from '../../utils/authSession';
import { Button } from '../common/Styled';
import { LoginBox, LoginFields, LoginInput, LoginError } from './Header.styles';

export default function HeaderLoginBox() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await login({ email: email.trim(), password });
      saveTokens(data.accessToken, data.refreshToken);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginBox onSubmit={handleSubmit}>
      <LoginFields>
        <LoginInput
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          autoComplete="email"
        />
        <LoginInput
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          autoComplete="current-password"
        />
        <Button type="submit" $variant="primary" $size="sm" disabled={loading}>
          {loading ? '...' : '로그인'}
        </Button>
      </LoginFields>
      <Link to="/signup" className="signup-link">
        회원가입
      </Link>
      {error && <LoginError>{error}</LoginError>}
    </LoginBox>
  );
}
