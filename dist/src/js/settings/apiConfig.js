export default {
  obj: {
    backendApi: {
      url: 'https://afternoon-falls-25894.herokuapp.com/',
      defaultHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      loginPage: {
        login: {
          action: 'signin',
          method: 'POST',
        },
        register: {
          action: 'users',
          method: 'POST',
        },
      },
    },
  },
};
