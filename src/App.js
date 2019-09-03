import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import slug from 'slug';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import userService from './services/user';
import workoutService from './services/workouts';
import { useResource } from './services/useResource';
import Header from './components/Header';
import Footer from './components/Footer';
import { Badge } from './components/BadgesView';
import { apiUrls } from './config/config';
import { checkAchievements, checkDailyChallenges } from './utils/badges';
import Routes from './Routes';

import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';

const App = props => {
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState(null);
  const [challenges, challengeService] = useResource(apiUrls.challenges, user);
  const [activities, activityService] = useResource(apiUrls.activities, user);
  const [achievements, achievementService] = useResource(apiUrls.achievements, user);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const localStorageUser = JSON.parse(loggedUserJSON);
      setUser(localStorageUser);

      // set the axios global default token
      userService.setToken(localStorageUser.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      workoutService
        .get()
        .then(result => {
          setWorkouts(result.data);
        })
        .catch(error => toast.warn('Failed to load your workouts.'));
    }
  }, [user]);

  const updateUser = updatedUser => {
    userService
      .update(updatedUser)
      .then(response => {
        const newUserState = { token: user.token, ...response.data };
        setUser(newUserState);
        localStorage.setItem('loggedUser', JSON.stringify(newUserState));
        toast.success('User profile updated.');
      })
      .catch(error => toast.warn('Failed to update user profile.'));
  };

  const addWorkout = (activityId, workout) => {
    if (user.activeChallenge) {
      const myBadgesBefore = checkAchievements(
        workouts,
        activities,
        achievements,
        activeChallenge()
      ).concat(checkDailyChallenges(workouts, activities, achievements, activeChallenge()));
      workoutService
        .add(activityId, workout)
        .then(response => {
          let newWorkouts;
          if (
            workouts.length === 0 ||
            workouts.filter(w => w.id === response.data.id).length === 0
          ) {
            newWorkouts = [...workouts, response.data];
          } else {
            const workoutsWithNew = workouts.map(w =>
              w.id !== response.data.id ? w : response.data
            );
            newWorkouts = workoutsWithNew;
          }
          setWorkouts(newWorkouts);
          toast.success('Workout saved.');
          const myBadgesAfter = checkAchievements(
            newWorkouts,
            activities,
            achievements,
            activeChallenge()
          ).concat(checkDailyChallenges(newWorkouts, activities, achievements, activeChallenge()));
          if (myBadgesAfter.length > myBadgesBefore.length) {
            const newBadges = myBadgesAfter.filter(x => !myBadgesBefore.includes(x));
            badgeAlert(newBadges);
          }
        })
        .catch(error => toast.warn('Failed to save a workout.'));
    } else {
      toast.warn('Workout not saved! Please select a challenge first.');
    }
  };

  const updateWorkout = workout => {
    if (user.activeChallenge) {
      const myBadgesBefore = checkAchievements(
        workouts,
        activities,
        achievements,
        activeChallenge()
      ).concat(checkDailyChallenges(workouts, activities, achievements, activeChallenge()));
      workoutService
        .update(workout)
        .then(response => {
          const workoutsWithNew = workouts.map(w =>
            w.id !== response.data.id ? w : response.data
          );
          setWorkouts(workoutsWithNew);
          toast.success('Workout updated.');
          const myBadgesAfter = checkAchievements(
            workoutsWithNew,
            activities,
            achievements,
            activeChallenge()
          ).concat(
            checkDailyChallenges(workoutsWithNew, activities, achievements, activeChallenge())
          );
          if (myBadgesAfter.length > myBadgesBefore.length) {
            const newBadges = myBadgesAfter.filter(x => !myBadgesBefore.includes(x));
            badgeAlert(newBadges);
          }
        })
        .catch(error => toast.warn('Failed to update the workout.'));
    } else {
      toast.warn('Workout not saved! Please select a challenge first.');
    }
  };

  const deleteWorkoutInstance = workout => {
    if (user.activeChallenge) {
      workoutService
        .deleteWInstance(workout)
        .then(response => {
          if (response.status === 204) {
            setWorkouts(workouts.filter(w => w.id !== workout.id));
            toast.success('Whole workout deleted.');
          } else {
            const workoutsWithNew = workouts.map(w =>
              w.id !== response.data.id ? w : response.data
            );
            setWorkouts(workoutsWithNew);
            toast.success('Workout instance deleted.');
          }
        })
        .catch(error => toast.warn('Failed to delete the workout instance.'));
    } else {
      toast.warn('Workout instance not deleted! Please select a challenge first.');
    }
  };

  const login = userDetails => {
    userService
      .login(userDetails)
      .then(response => {
        setUser(response.data);
        // set the axios global default token
        userService.setToken(response.data.token);
        localStorage.setItem('loggedUser', JSON.stringify(response.data));
        props.history.push('/');
      })
      .catch(error => {
        toast.error('Login failed.');
      });
  };

  const register = userDetails => {
    userService
      .register(userDetails)
      .then(response => {
        login(userDetails);
      })
      .catch(error => {
        toast.error('Failed to create an account.');
      });
  };

  const logout = () => {
    setUser(null);
    setWorkouts([]);
    localStorage.removeItem('loggedUser');
  };

  const isAuthenticated = () => {
    return localStorage.getItem('loggedUser') !== null;
  };

  const activityByName = name => {
    for (let a of activities) {
      if (slug(a.name, { lower: true }) === name) {
        return a;
      }
    }
  };

  const activeChallenge = () => {
    if (user && user.activeChallenge) {
      return challenges.find(c => c.id === user.activeChallenge);
    }
    return undefined; // components check for undefined, not null
  };

  // styles
  const MySwal = withReactContent(Swal);
  const badgeAlert = achs => {
    MySwal.fire({
      titleText: 'Good job!',
      html: (
        <div>
          <p className="is-size-5" style={{ padding: '1em' }}>
            <span role="img" aria-label="fire">
              🔥
            </span>
            {achs.length > 1 ? ' New badges unlocked:' : ' New badge unlocked:'}
          </p>
          {achs.map(a => (
            <Badge
              achievement={a}
              key={a.id}
              activity={activities.find(ac => ac.id === a.activity)}
            />
          ))}
        </div>
      ),
      type: 'success',
      showCloseButton: true
    });
  };

  return (
    <>
      {isAuthenticated() && <Header logout={logout} />}
      <div className="push-footer-to-bottom">
        <Routes
          user={user}
          updateUser={updateUser}
          login={login}
          register={register}
          isAuthenticated={isAuthenticated}
          activityByName={activityByName}
          activeChallenge={activeChallenge}
          workouts={workouts}
          activities={activities}
          achievements={achievements}
          challenges={challenges}
          addWorkout={addWorkout}
          updateWorkout={updateWorkout}
          deleteWorkoutInstance={deleteWorkoutInstance}
          challengeService={challengeService}
          achievementService={achievementService}
          activityService={activityService}
          userService={userService}
        />
      </div>
      <ToastContainer pauseOnFocusLoss={false} position="bottom-right" />
      {isAuthenticated() && <Footer />}
    </>
  );
};
export default withRouter(App);
