export interface EitherL<L> {
    isLeft: true;
    left: L;
  }

  export interface EitherR<R> {
    isRight: true;
    right: R;
  }

  export interface JSeither<L, R> {
    mapLeftRight: (left: (l: L) => void, right: (r: R) => void) => void;
  }
