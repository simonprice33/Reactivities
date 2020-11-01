import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Item, Button, Label, Segment } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';

const ActivityList: React.FC = ({}) => {
  const activityStore = useContext(ActivityStore);
  const {
    activitiesByDate,
    deleteActivity,
    submitting,
    target,
  } = activityStore;
  return (
    <div>
      <Segment clearing>
        <Item.Group divided>
          {activitiesByDate.map((activity) => (
            <Item key={activity.id}>
              <Item.Content>
                <Item.Header as='a'>{activity.title}</Item.Header>
                <Item.Meta>{activity.date}</Item.Meta>
                <Item.Description>
                  <div>{activity.description}</div>
                  <div>
                    {activity.category}, {activity.venue}
                  </div>
                </Item.Description>
                <Item.Extra>
                  <Button
                    as={Link}
                    to={`/activities/${activity.id}`}
                    floated='right'
                    content='View'
                    color='blue'
                    name={`view-${activity.id}`}
                  />
                  <Button
                    onClick={(e) => deleteActivity(e, activity.id)}
                    floated='right'
                    content='Delete'
                    color='red'
                    loading={target === activity.id && submitting}
                    name={activity.id}
                  />
                  <Label basic content={activity.category} />
                </Item.Extra>
              </Item.Content>
            </Item>
          ))}
        </Item.Group>
      </Segment>
    </div>
  );
};

export default observer(ActivityList);
