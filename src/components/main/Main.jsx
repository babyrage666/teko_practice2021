import React from 'react';
import { Redirect } from 'react-router-dom';
import { ApiClient } from '../../utils/api-client';
import TekoLogo from '../../assets/svg/teko-logo.svg';

export default class Main extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isAuthenticated: false,
    };
  }

  componentDidMount() {
    ApiClient.auth.me()
      .then(() => {
        this.setState({ loading: false, isAuthenticated: true });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { loading, isAuthenticated } = this.state;

    if (loading) {
      return (
        <div className="main-page">
          Загрузка...
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Redirect to="/auth" />;
    }

    return (
      <div className="main-page">
        <TekoLogo />
      </div>
    );
  }
}
