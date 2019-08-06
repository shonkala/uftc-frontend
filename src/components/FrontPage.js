import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

const Ikonipallo = ({ sarja, osallistujia, iconName, bgColor, handleClick, selected }) => {
  let styles = {
    backgroundColor: bgColor,
    width: '33vw',
    minWidth: '110px',
    maxWidth: '200px',
    height: '33vw',
    minHeight: '110px',
    maxHeight: '200px',
    borderRadius: '33vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    cursor: 'pointer'
  };
  // todo: hover
  if (selected) {
    styles = {
      ...styles,
      borderStyle: 'solid',
      borderColor: 'black',
      borderWidth: '6px'
    };
  }

  return (
    <div
      style={styles}
      className="has-text-centered has-text-white-ter is-size-6-mobile is-size-5-tablet is-size-4-desktop is-size-3"
      onClick={() => {
        console.log('klikkasit', sarja);
        handleClick();
      }}
    >
      <FontAwesomeIcon icon={iconName} size="2x" />
      <p>{sarja.seriesTitle}</p>
      <p style={{ color: '#000000', fontWeight: 'bold' }}>
        {osallistujia ? osallistujia : <>&nbsp;</>}
      </p>
    </div>
  );
};

const BraceLeft = () => <span style={{ fontFamily: 'Verdana', color: '#ff2457' }}>&#x7b;</span>;

const BraceRight = () => <span style={{ fontFamily: 'Verdana', color: '#ff2457' }}>&#x7d;</span>;

const FrontPage = props => {
  const [selectedSeries, setSelectedSeries] = useState(null);

  const handleClickOnBall = seriesId => () => {
    if (props.user && !props.user.activeChallenge) return setSelectedSeries(seriesId);
  };

  const saveSelection = () => {
    const userDetails = {
      ...props.user,
      activeChallenge: selectedSeries
    };
    console.log('Updating user data:', userDetails);
    props.updateUser(userDetails);
  };

  const today = moment();
  const challengesToShow = props.challenges.filter(c =>
    moment(c.releaseDate).isSameOrBefore(today, 'day')
  );
  const challengeNames = Array.from(new Set(challengesToShow.map(c => c.name)));

  const showActiveChallenge = () => (
    <>
      <div className="ambientia-block" />
      <div> Your challenge</div>
    </>
  );

  const showSelectionButton = () => (
    <>
      <div className="has-text-weight-bold is-size-5-mobile is-size-4-tablet is-size-3">
        Pick this series?
      </div>
      <button onClick={saveSelection} className="button is-large is-success is-rounded">
        Yes, let's begin!
      </button>
    </>
  );

  const challengeSelections = challenges =>
    challenges.map(c => (
      <div className="column is-4 has-text-centered " key={c.id}>
        <Ikonipallo
          sarja={c}
          iconName={c.icon || 'stopwatch'}
          bgColor="#ff2457"
          handleClick={handleClickOnBall(c.id)}
          selected={c.id === selectedSeries}
        />
        <div className="is-size-6-mobile is-size-5-tablet is-size-4">{c.description || ''}</div>
        <div className="has-text-weight-bold is-size-6-mobile is-size-5-tablet is-size-4">
          {props.user && props.user.activeChallenge === c.id && showActiveChallenge()}
        </div>
        <section className="section">
          {props.user &&
            !props.user.activeChallenge &&
            selectedSeries === c.id &&
            showSelectionButton()}
        </section>
      </div>
    ));

  return (
    <>
      <section className="section has-text-centered">
        <h1 className="title is-1 ">Welcome to UFTC!</h1>
      </section>
      {challengeNames.map(challengeName => (
        <section className="section" key={challengeName}>
          <div className="section has-text-centered">
            <h1 className="title is-2">
              <BraceLeft /> {challengeName} <BraceRight />
            </h1>
            <h2 className="title is-3">Select series</h2>
          </div>
          <div className="columns is-centered">
            {challengeSelections(challengesToShow.filter(c => c.name === challengeName))}
          </div>
        </section>
      ))}
    </>
  );
};

export default FrontPage;
