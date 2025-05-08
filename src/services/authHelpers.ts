let _onTokenRefreshed: (() => void) | null = null;

export const setOnTokenRefreshed = (fn: (() => void) | null) => {
  _onTokenRefreshed = fn;
};

export const getOnTokenRefreshed = () => _onTokenRefreshed;
