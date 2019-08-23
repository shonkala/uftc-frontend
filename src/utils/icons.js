import React from 'react';
import { ReactComponent as Box } from '../icons/icon.svg'; // placeholder box
import { ReactComponent as KettleBell } from '../icons/kettlebell.svg';
import { ReactComponent as Walking } from '../icons/walking.svg';
import { ReactComponent as Cycling } from '../icons/cycling.svg';
import { ReactComponent as Plank } from '../icons/plank.svg';
import { ReactComponent as PullUp } from '../icons/pullup.svg';
import { ReactComponent as PushUp } from '../icons/pushup.svg';
import Icon from '../components/Icon';

const icon = iconName => {
  if (!iconName.toLowerCase().endsWith('.svg')) {
    return <Icon icon={iconName} size="2x" color="black" />;
  }
  switch (iconName) {
    case 'kettlebell.svg':
      return <KettleBell />;
    case 'walking.svg':
      return <Walking />;
    case 'cycling.svg':
      return <Cycling />;
    case 'plank.svg':
      return <Plank />;
    case 'pullup.svg':
      return <PullUp />;
    case 'pushup.svg':
      return <PushUp />;
    default:
      return <Box />;
  }
};

export { icon };
