import React from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

const DeleteWorkout = props => {
  if (!props.delWorkout) {
    props.setDeleteWorkout(null);
    return (
      <div>
        <h1>Error delWorkout was empty</h1>
      </div>
    );
  }
  const submit = event => {
    event.preventDefault();
    props.setDeleteWorkout(null); //if you remove this, do something to take this state concern

    const delworkout = {
      id: props.delWorkout.workoutid,
      activity: props.delWorkout.activity,
      instance: {
        id: props.delWorkout._id,
        date: props.delWorkout.date,
        amount: props.delWorkout.amount
      }
    };

    props.deleteWorkoutInstance(delworkout);
  };

  return (
    <form onSubmit={submit}>
      <div className="field is-grouped">
        <p className="help is-size-6 has-text-white">
          Do you want to delete workout {props.match.params.name} from
          {'  '}
          date {moment(props.delWorkout.date).format('ddd MMM Do')}?
        </p>
        <div className="field">
          <p className="control">
            <button className="button is-success is-fullwidth is-medium">Yes</button>
          </p>
        </div>
      </div>
      <div className="field">
        <p className="control">
          <button
            className="button is-fullwidth"
            onClick={event => {
              event.preventDefault();
              props.setDeleteWorkout(null);
              props.setShowModal(false);
              let modalWnd = document.querySelector('.modal');
              if (modalWnd) {
                modalWnd.classList.remove('is-active');
              }
            }}
          >
            Go back
          </button>
        </p>
      </div>
    </form>
  );
};

export default withRouter(DeleteWorkout);
