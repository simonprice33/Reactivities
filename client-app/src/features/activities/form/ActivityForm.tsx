import React, { FormEvent, useContext, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';

interface IProps {
  activity: IActivity;
}

const ActivityForm: React.FC<IProps> = ({ activity: initialFormState }) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    cancelFormOpen,
    submitting,
  } = activityStore;

  const initForm = () => {
    if (initialFormState) {
      return initialFormState;
    } else {
      return {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initForm);

  const handleSubmit = () => {
    if (activity.id.length > 0) {
      // Update
      editActivity(activity);
    } else {
      // Create
      let newActivity = {
        ...activity,
        id: uuid(),
      };

      createActivity(newActivity);
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          placeholder='Title'
          value={activity.title}
          onChange={handleInputChange}
          name='title'
        />
        <Form.TextArea
          rows={2}
          placeholder='Description'
          value={activity.description}
          onChange={handleInputChange}
          name='description'
        />
        <Form.Input
          placeholder='Category'
          value={activity.category}
          onChange={handleInputChange}
          name='category'
        />
        <Form.Input
          type='datetime-local'
          placeholder='Date'
          value={activity.date}
          onChange={handleInputChange}
          name='date'
        />
        <Form.Input
          placeholder='City'
          value={activity.city}
          onChange={handleInputChange}
          name='city'
        />
        <Form.Input
          placeholder='Venue'
          value={activity.venue}
          onChange={handleInputChange}
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
          onClick={() => cancelFormOpen()}
          floated='right'
          type='submit'
          content='Cancel'
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
