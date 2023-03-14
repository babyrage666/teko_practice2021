import React, {useState} from "react";
import { ApiClient } from '../../utils/api-client';
import TekoLogo from '../../assets/svg/teko-logo.svg';
import ErrorImg from '../../assets/svg/error.svg';
import { useHistory } from "react-router-dom";

function ErrorMessage() {
  return (
    <div className='auth-page-content-error'>
      <ErrorImg/>
      <p>Введен неправильный адрес электронной почты или пароль.</p>
    </div>
  );
}
function Auth() {
  const [loading, setLoading] = useState(false),
        [err, setError] = useState(null),
        [login, setUsername] = useState(''),
        [password, setPassword] = useState(''),
        history = useHistory();
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    ApiClient.auth.login({ login, password })
    .then(response => {
      console.log()
      setError(null);
      localStorage.setItem('authData', JSON.stringify(response));
      setLoading(false);
      history.push('/');
    })
    .catch(response => {
      setError(true);
      setLoading(false);
    });
  }
  return (
    <div className="auth-page-content">
      <TekoLogo className='auth-page-content-logo'/>
      <h1>Добро пожаловать!</h1>
      <form onSubmit={onSubmit}>
        {err && <ErrorMessage/>}
        <label>
          <p>E-mail</p>
          <input type="text" onChange={e => setUsername(e.target.value)}/>
        </label>
        <label>
          <div className='auth-page-content-password'>
            <p>Пароль</p>
            <a href="#">Забыли пароль?</a>
          </div>
          <input type="password" onChange={e => setPassword(e.target.value)}/>
        </label>
        <button type="submit" disabled={!password  || !login}>Войти</button>
      </form>
    </div>
  );
}

export default Auth;
