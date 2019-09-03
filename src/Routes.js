import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddChallengeForm from './components/Admin/AddChallengeForm';
import LoginForm from './components/LoginForm';
import AddActivityForm from './components/Admin/AddActivityForm';
import UpdateUserForm from './components/UpdateUserForm';
import AddAchievementForm from './components/Admin/AddAchievementForm';
import BadgesView from './components/BadgesView';
import ChallengeSelectView from './components/ChallengeSelectView';
import PasswordResetForm from './components/PasswordResetForm';
import RequestResetEmailForm from './components/RequestResetEmailForm';
import StyleGuide from './components/StyleGuide';
import NotFound from './components/NotFound';
import About from './components/About';
import { ActivitiesView, LeaderBoardView, WorkoutView, AdminView, TopFives } from './components';

const Routes = props => {
  const {
    user,
    updateUser,
    login,
    register,
    isAuthenticated,
    activityByName,
    activeChallenge,
    workouts,
    activities,
    challenges,
    achievements,
    addWorkout,
    updateWorkout,
    deleteWorkoutInstance,
    challengeService,
    achievementService,
    activityService,
    userService
  } = props;

  return (
    <Switch>
      {!isAuthenticated() && (
        <Switch>
          <Route
            exact
            path="/login/:secret"
            render={({ match }) => (
              <LoginForm login={login} register={register} secret={match.params.secret} />
            )}
          />
          <Route exact path="/passwordreset" render={() => <RequestResetEmailForm />} />
          <Route
            exact
            path="/passwordreset/:token"
            render={({ match }) => <PasswordResetForm resetToken={match.params.token} />}
          />
          <Route path="/" render={() => <LoginForm login={login} register={register} />} />
        </Switch>
      )}

      <Route
        exact
        path="/activities"
        render={() => (
          <ActivitiesView
            challenge={activeChallenge()}
            workouts={workouts}
            activities={activities}
            achievements={achievements}
          />
        )}
      />
      <Route
        exact
        path="/activities/:name"
        render={({ match }) => (
          <WorkoutView
            activity={activityByName(match.params.name)}
            addWorkout={addWorkout}
            challenge={activeChallenge()}
            workouts={workouts}
            updateWorkout={updateWorkout}
            deleteWorkoutInstance={deleteWorkoutInstance}
          />
        )}
      />
      <Route
        path="/leaderboard"
        render={() => <LeaderBoardView challenges={challenges} user={user} />}
      />
      <Route
        path="/topfives"
        render={() => <TopFives activities={activities} challenges={challenges} />}
      />
      <Route path="/about" render={() => <About />} />
      <Route
        path="/addchallenge"
        render={() => (
          <AddChallengeForm
            challengeService={challengeService}
            challenges={challenges}
            userService={userService}
            user={user}
          />
        )}
      />
      <Route
        path="/addachievement"
        render={() => (
          <AddAchievementForm
            achievementService={achievementService}
            activities={activities}
            achievements={achievements}
          />
        )}
      />
      <Route
        path="/badges"
        render={() => (
          <BadgesView
            workouts={workouts}
            activities={activities}
            achievements={achievements}
            challenge={activeChallenge()}
          />
        )}
      />
      <Route
        path="/addactivity"
        render={() => <AddActivityForm activityService={activityService} activities={activities} />}
      />
      <Route
        path="/updateuser"
        render={() => <UpdateUserForm updateUser={updateUser} user={user} />}
      />
      <Route path="/admin" render={() => <AdminView challenges={challenges} user={user} />} />
      <Route exact path="/styleguide" render={() => <StyleGuide />} />
      <Route
        exact
        path="/selectseries"
        render={() => (
          <ChallengeSelectView challenges={challenges} updateUser={updateUser} user={user} />
        )}
      />
      {!activeChallenge() ? (
        <Route
          exact
          path="/"
          render={() => (
            <ChallengeSelectView challenges={challenges} updateUser={updateUser} user={user} />
          )}
        />
      ) : (
        <Route
          exact
          path="/"
          render={() => (
            <ActivitiesView
              challenge={activeChallenge()}
              workouts={workouts}
              activities={activities}
              achievements={achievements}
            />
          )}
        />
      )}
      <Route path="/" component={NotFound} />
    </Switch>
  );
};

export default Routes;
