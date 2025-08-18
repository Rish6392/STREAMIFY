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
      friends: ['u2'],
    },
    {
      _id: 'u2',
      fullName: 'Crish',
      email: 'crish@example.com',
      password: 'password',
      profilePic: 'https://avatar.iran.liara.run/public/2.png',
      bio: 'Language buddy',
      nativeLanguage: 'hindi',
      learningLanguage: 'italian',
      location: 'Delhi, IN',
      isOnboarded: true,
      friends: ['u1'],
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

function onBoth(mock, method, path, handler) {
  const register = (m, p) => {
    if (m === 'get') mock.onGet(p).reply(handler);
    if (m === 'post') mock.onPost(p).reply(handler);
    if (m === 'put') mock.onPut(p).reply(handler);
  };
  register(method, path);
  // Also register with /api prefix to catch baseURL-prefixed URLs
  register(method, `/api${path.startsWith('/') ? '' : '/'}${path}`);
}

export function enableMockApi() {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 400 });

  // Auth: /auth/signup
  onBoth(mock, 'post', '/auth/signup', config => {
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
  onBoth(mock, 'post', '/auth/login', config => {
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
  onBoth(mock, 'post', '/auth/logout', () => {
    setCookie('jwt', '', -1);
    return [200, { success: true, message: 'Logout successfully' }];
  });

  // Auth: /auth/me
  onBoth(mock, 'get', '/auth/me', () => {
    const token = getCookie('jwt');
    const uid = token && db.sessions[token];
    const user = db.users.find(u => u._id === uid);
    if (!user) return [401, { message: 'Unauthorised-No Token provided' }];
    return [200, { success: true, user }];
  });

  // Onboarding
  onBoth(mock, 'post', '/auth/onboarding', config => {
    const token = getCookie('jwt');
    const uid = token && db.sessions[token];
    const user = db.users.find(u => u._id === uid);
    if (!user) return [401, { message: 'Unauthorised-No Token provided' }];
    const body = JSON.parse(config.data || '{}');
    Object.assign(user, body, { isOnboarded: true });
    return [200, { success: true, user }];
  });

  // Minimal users endpoints used by UI
  onBoth(mock, 'get', '/users', () => {
    const token = getCookie('jwt');
    if (!token || !db.sessions[token]) return [401, { message: 'Unauthorised-No Token provided' }];
    return [200, db.users];
  });

  onBoth(mock, 'get', '/users/friends', () => {
    const token = getCookie('jwt');
    const uid = token && db.sessions[token];
    const user = db.users.find(u => u._id === uid);
    if (!user) return [401, { message: 'Unauthorised-No Token provided' }];
    const friends = user.friends.map(fid => db.users.find(u => u._id === fid)).filter(Boolean);
    return [200, friends];
  });
  onBoth(mock, 'get', '/users/friend-requests', () => [200, []]);
  onBoth(mock, 'get', '/users/outgoing-friend-requests', () => [200, []]);
  mock.onPost(/\/(api\/)?users\/friend-request\//).reply(() => [200, { success: true }]);
  mock.onPut(/\/(api\/)?users\/friend-request\/.+\/accept/).reply(() => [200, { success: true }]);

  // Chat token mock
  onBoth(mock, 'get', '/chat/token', () => {
    return [200, { token: 'mock-stream-token' }];
  });
}
