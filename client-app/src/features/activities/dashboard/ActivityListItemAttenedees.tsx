import { Image, List, Popup } from 'semantic-ui-react';

import { IAttendee } from '../../../app/models/activity';
import React from 'react';

interface IProps {
  attendees: IAttendee[];
}

export const ActivityListItemAttenedees: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <List.Item key={attendee.userName}>
          <Popup
            header={attendee.displayName}
            trigger={
              <Image
                size='mini'
                circular
                src={attendee.image || '/assets/user.png'}
              ></Image>
            }
          />
        </List.Item>
      ))}
    </List>
  );
};
