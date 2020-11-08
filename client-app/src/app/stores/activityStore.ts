import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';
import { IActivity } from '../models/activity';

configure({ enforceActions: 'always' });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date!.toISOString().split('T')[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();

      runInAction('loading activities', () => {
        activities.forEach((activity) => {
          activity.date = new Date(activity.date!);
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
      });
    } catch (error) {
      runInAction('load activities error', () => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  @action loadActivity = async (id: string) => {
    this.loadingInitial = true;
    try {
      let activity = this.getActivity(id);
      if (activity) {
        activity.date = new Date(activity.date);
        this.activity = activity;
        this.loadingInitial = false;
      } else {
        activity = await agent.Activities.details(id);
        runInAction('load activity', () => {
          this.activity = activity;
          this.loadingInitial = false;
        });
      }
    } catch (error) {
      runInAction('load activity error', () => {
        this.loadingInitial = false;
      });
      throw error;
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('create an activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
    } catch (error) {
      runInAction('create activity error', () => {
        console.log(error);
        this.submitting = false;
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('edit an activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
    } catch (error) {
      runInAction('edit an activity error', () => {
        console.log(error);
        this.submitting = false;
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.target = event.currentTarget.name;
    this.submitting = true;
    try {
      await agent.Activities.delete(id);
      runInAction('delete an activity', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('delete an activity error', () => {
        console.log(error);
        this.submitting = false;
        this.target = '';
      });
    }
  };
}

export default createContext(new ActivityStore());
