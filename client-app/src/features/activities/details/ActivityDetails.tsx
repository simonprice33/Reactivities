import { Grid, GridColumn } from 'semantic-ui-react';
import React, { useContext, useEffect } from 'react';

import { ActivityDetailsChat } from './ActivityDetailsChat';
import ActivityDetailsHeader from './ActivityDetailsHeader';
import { ActivityDetailsInfo } from './ActivityDetailsInfo';
import ActivityDetailsSideBar from './ActivityDetailsSideBar';
import ActivityStore from '../../../app/stores/activityStore';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

interface DetailParams {
  id: string;
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const { activity, loadActivity, loadingInitial } = rootStore.activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id, history]);

  if (loadingInitial) return <LoadingComponent content='Loading Activity' />;

  if (!activity) return <h1>Acticity Not Found</h1>;
  return (
    <Grid>
      <GridColumn width={10}>
        <ActivityDetailsHeader activity={activity} />
        <ActivityDetailsInfo activity={activity} />
        <ActivityDetailsChat />
      </GridColumn>
      <GridColumn width={6}>
        <ActivityDetailsSideBar attendees={activity.attendees} />
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityDetails);
