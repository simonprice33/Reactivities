import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';
import React, { Fragment, useContext } from 'react';

import { Link } from 'react-router-dom';
import { LoginForm } from '../user/LoginForm';
import RegisterForm from '../user/RegisterForm';
import { RootStoreContext } from '../../app/stores/rootStore';

export const HomePage = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/logo.png'
            alt='logo'
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        {isLoggedIn && user ? (
          <Fragment>
            <Header
              as='h2'
              inverted
              content={`Welcome back ${user.displayName}`}
            />
            <Button as={Link} to='/activities' size='huge' inverted>
              Go to Activities
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Header as='h2' inverted content='Welcome to Reactivities' />
            <Button
              onClick={() => openModal(<LoginForm />)}
              size='huge'
              inverted
            >
              Log in
            </Button>
            <Button
              onClick={() => openModal(<RegisterForm />)}
              size='huge'
              inverted
            >
              Register
            </Button>
          </Fragment>
        )}
      </Container>
    </Segment>
  );
};
