import React, { useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './styles.css';
import NavBar from '../../features/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { LoadingComponent } from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
    console.log(activityStore.activities);
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content='Loading Activities...' />;

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
};

export default observer(App);
