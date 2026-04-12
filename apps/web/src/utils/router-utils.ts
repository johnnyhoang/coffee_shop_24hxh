import { UIMatch } from '@remix-run/router/utils';

type TMatchHandle = {
  title?: string;
};

type TUIMatch<P = unknown, Q = unknown> = {
  handle?: TMatchHandle;
} & UIMatch<P, Q>;

export const findMatchTitle = (matches: TUIMatch[]): string => {
  return matches.find((match) => Boolean(match.handle?.title))?.handle.title;
};
