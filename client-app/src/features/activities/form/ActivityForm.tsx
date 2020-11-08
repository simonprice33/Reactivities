import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { Button, Form, Grid, GridColumn, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from '../../../app/common/form/TextInput';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    activity: initialFormState,
    loadActivity,
    clearActivity,
  } = activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: null,
    city: '',
    venue: '',
  });

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      console.log(match.params.id);
      loadActivity(match.params.id).then(() => {
        initialFormState && setActivity(initialFormState);
      });
    }

    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    match.params.id,
    clearActivity,
    initialFormState,
    activity.id.length,
  ]);

  const handleFinalFormSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Grid>
      <GridColumn width={10}>
        <Segment clearing>
          <FinalForm
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  placeholder='Title'
                  value={activity.title}
                  name='title'
                  component={TextInput}
                />
                <Field
                  placeholder='Description'
                  value={activity.description}
                  component={TextAreaInput}
                  rows={3}
                  name='description'
                />
                <Field
                  placeholder='Category'
                  value={activity.category}
                  component={SelectInput}
                  options={category}
                  name='category'
                />
                <Form.Group widths='equal'>
                  <Field
                    component={DateInput}
                    name='date'
                    date={true}
                    placeholder='Date'
                    value={activity.date}
                  />
                  <Field
                    component={DateInput}
                    name='time'
                    time={true}
                    placeholder='Time'
                    value={activity.date}
                  />
                </Form.Group>
                <Field
                  placeholder='City'
                  value={activity.city}
                  component={TextInput}
                  name='city'
                />
                <Field
                  placeholder='Venue'
                  value={activity.venue}
                  component={TextInput}
                  name='venue'
                />
                <Button
                  loading={submitting}
                  floated='right'
                  positive
                  type='submit'
                  content='Submit'
                  name='title'
                />
                <Button
                  onClick={() => history.push('/activities')}
                  floated='right'
                  type='submit'
                  content='Cancel'
                />
              </Form>
            )}
          />
        </Segment>
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityForm);
