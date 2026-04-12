import clsx from 'clsx';

import { Spinner } from '../spinner';

export type LoadingProps = {
  className?: string;
};

export const Loading = ({ className }: LoadingProps) => (
  <div
    className={clsx(
      'flex h-full w-full items-center justify-center',
      className,
    )}
  >
    <Spinner />
  </div>
);
