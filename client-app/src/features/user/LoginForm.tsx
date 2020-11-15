import { Button, Form, Header, Label, Placeholder } from 'semantic-ui-react';
import { Field, Form as FinalForm } from 'react-final-form';
import React, { useContext } from 'react';
import { combineValidators, composeValidators, isRequired } from 'revalidate';

import ErrorMessage from '../../app/common/form/ErrorMessage';
import { FORM_ERROR } from 'final-form';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import { TextInput } from '../../app/common/form/TextInput';

const validate = combineValidators({
  email: isRequired('email'),
  password: isRequired('password'),
});

export const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;

  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as='h2' content='Login' color='teal' />
          <Field name='email' component={TextInput} placeholder='Email'></Field>
          <Field
            name='password'
            component={TextInput}
            placeholder='Email'
            type='Password'
          ></Field>
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text={'Invalid Username or Password'}
            />
          )}
          <Button
            loading={submitting}
            color='teal'
            content='Login'
            fluid
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
          />
        </Form>
      )}
    />
  );
};
