import React from 'react';
import PropTypes from 'prop-types';
import { ApiClient } from '../../utils/api-client';

export default class Auth extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      username: '',
      password: '',
    };
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { username, password } = this.state;
    this.setState({ loading: true });

    ApiClient.auth.login({ username, password })
      .then();
  };

  render() {
    // const { loading, login, password } = this.state;

    return (
      <div className="auth-page">
        <h1>Добро пожаловать!</h1>
        <form onSubmit={this.onSubmit}>
          {/*...*/}
          <label>
            <p>E-mail</p>
            <input type="text" />
          </label>
          <label>
            <p>Пароль</p>
            <input type="password" />
          </label>
          <button type="submit">Войти</button>
        </form>
      </div>
    );
  }
}
