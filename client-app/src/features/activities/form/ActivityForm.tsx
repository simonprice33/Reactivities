import { v4 as uuid } from 'uuid';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Grid, GridColumn, Segment } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from '../../../app/common/form/TextInput';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndtime } from '../../../app/common/util/util';
import {
  combineValidators,
  composeValidators,
  hasLengthGreaterThan,
  isRequired,
} from 'revalidate';

interface DetailParams {
  id: string;
}

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired({ message: 'The event category is required' }),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(5)({
      message: 'Description has a minimum lenght of 5 characters',
    })
  )(),
  city: isRequired({ message: 'The event City is required' }),
  venue: isRequired({ message: 'The event Venue is required' }),
  date: isRequired({ message: 'The event Date is required' }),
  time: isRequired({ message: 'The event Time is required' }),
});

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
  } = activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndtime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    if (activity.id) {
      // Update
      console.log('logging edit');
      console.log(activity);
      editActivity(activity);
    } else {
      // Create
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      console.log('logging create');
      console.log(newActivity);

      createActivity(newActivity);
    }
  };

  return (
    <Grid>
      <GridColumn width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
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
                    value={activity.time}
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
                  disabled={loading || invalid || pristine}
                />
                <Button
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push(`/activities  `)
                  }
                  floated='right'
                  type='submit'
                  content='Cancel'
                  disabled={loading}
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
