import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { useTranslation, Trans } from 'react-i18next';

export default function LoginScreen() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post(
        'https://procos.herokuapp.com/api/users/login',
        {
          email,
          password,
        }
      );
      ctxDispatch({ type: 'USER_LOGIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container register__container">
      <Helmet>
        <title>{t('pages.login.helmet')}</title>
      </Helmet>
      <h1 className="page__header">{t('pages.login.header')}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="" controlId="email">
          <Form.Control
            className="register_form-control"
            placeholder={t('pages.login.email')}
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="" controlId="password">
          <Form.Control
            className="register_form-control"
            placeholder={t('pages.login.password')}
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="register__submit">
          <Button className="register__submit-button" type="submit">
            {t('pages.login.button')}
          </Button>
        </div>
        <div className="register__login-redirect">
          {t('pages.login.underButton1')}{' '}
          <Link to={`/register?redirect=${redirect}`}>
            {t('pages.login.underButton2')}
          </Link>
        </div>
      </Form>
    </Container>
  );
}
