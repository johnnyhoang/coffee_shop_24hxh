import { useMatches } from 'react-router-dom';

import { findMatchTitle } from '../utils/router-utils';

export const Header = () => {
  const matches = useMatches();
  const title = findMatchTitle(matches);

  return (
    <>
      <span className="text-xl font-bold">{title}</span>
      <div className=""> Hello </div>
    </>
  );
};
