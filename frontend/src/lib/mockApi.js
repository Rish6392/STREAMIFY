// Simple browser-side mock API using axios-mock-adapter.
// Loads only when no VITE_API_URL is configured in production.

import MockAdapter from 'axios-mock-adapter';
import axiosInstance from './axios';

// In-memory store
const db = {
  users: [
    {
      _id: 'u1',
      fullName: 'Demo User',
      email: 'demo@example.com',
      password: 'password',
      profilePic: '',
      bio: '',
      nativeLanguage: '',
      learningLanguage: '',
      location: '',
      isOnboarded: true,
      friends: [],
    },
  ],
  sessions: {}, // key by cookie token
};

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function enableMockApi() {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 400 });

  // Auth: /auth/signup
  mock.onPost('/auth/signup').reply(config => {
    const body = JSON.parse(config.data || '{}');
    const { email, password, fullName } = body;
    if (!email || !password || !fullName) {
      return [400, { message: 'All fields are required' }];
    }
    if (db.users.find(u => u.email === email)) {
      return [400, { message: 'Email already existed, pls use a different one' }];
    }
    const user = {
      _id: 'u' + (db.users.length + 1),
      fullName,
      email,
      password,
      profilePic: '',
      bio: '',
      nativeLanguage: '',
      learningLanguage: '',
      location: '',
      isOnboarded: false,
      friends: [],
    };
    db.users.push(user);
    const token = 'mock-' + user._id;
    db.sessions[token] = user._id;
    setCookie('jwt', token);
    return [201, { success: true, user }];
  });

  // Auth: /auth/login
  mock.onPost('/auth/login').reply(config => {
    const body = JSON.parse(config.data || '{}');
    const { email, password } = body;
    const user = db.users.find(u => u.email === email);
    if (!user || user.password !== password) {
      return [401, { message: 'Invalid Email or Password' }];
    }
    const token = 'mock-' + user._id;
    db.sessions[token] = user._id;
    setCookie('jwt', token);
    return [200, { success: true, user }];
  });

  // Auth: /auth/logout
  mock.onPost('/auth/logout').reply(() => {
    setCookie('jwt', '', -1);
    return [200, { success: true, message: 'Logout successfully' }];
  });

  // Auth: /auth/me
  mock.onGet('/auth/me').reply(() => {
    const token = getCookie('jwt');
    const uid = token && db.sessions[token];
    const user = db.users.find(u => u._id === uid);
    if (!user) return [401, { message: 'Unauthorised-No Token provided' }];
    return [200, { success: true, user }];
  });

  // Onboarding
  mock.onPost('/auth/onboarding').reply(config => {
    const token = getCookie('jwt');
    const uid = token && db.sessions[token];
    const user = db.users.find(u => u._id === uid);
    if (!user) return [401, { message: 'Unauthorised-No Token provided' }];
    const body = JSON.parse(config.data || '{}');
    Object.assign(user, body, { isOnboarded: true });
    return [200, { success: true, user }];
  });

  // Minimal users endpoints used by UI
  mock.onGet('/users').reply(() => {
    const token = getCookie('jwt');
    if (!token || !db.sessions[token]) return [401, { message: 'Unauthorised-No Token provided' }];
    return [200, db.users];
  });

  mock.onGet('/users/friends').reply(() => [200, []]);
  mock.onGet('/users/friend-requests').reply(() => [200, []]);
  mock.onGet('/users/outgoing-friend-requests').reply(() => [200, []]);
  mock.onPost(/\/users\/friend-request\//).reply(() => [200, { success: true }]);
  mock.onPut(/\/users\/friend-request\/.+\/accept/).reply(() => [200, { success: true }]);

  // Chat token mock
  mock.onGet('/chat/token').reply(() => {
    return [200, { token: 'mock-stream-token' }];
  });
}
