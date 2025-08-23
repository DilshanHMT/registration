const setAccessToken = (accessToken) => {
  localStorage.setItem("accessToken", accessToken);
};

const setRefreshToken = (refreshToken) => {
  localStorage.setItem("refreshToken", refreshToken);
};

const setUserId = (userId) => {
  localStorage.setItem("userId", userId);
}

const getAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return accessToken
  }
  else {
    return null
  }
};

const getRefreshToken = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    return refreshToken
  }
  else {
    return null
  }
};

const getUserId = () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    return userId
  }
  else {
    return null
  }
};

const removeAccessToken = () => {
  localStorage.removeItem("accessToken");
}

const removeRefreshToken = () => {
  localStorage.removeItem("refreshToken");
}

const removeUserId = () => {
  localStorage.removeItem("userId");
}

export { setAccessToken, setRefreshToken, setUserId, getAccessToken, getRefreshToken, getUserId, removeAccessToken, removeRefreshToken, removeUserId };
