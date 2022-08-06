import React from 'react';
import { USER_INFO } from './constants';
import { UserInfo } from './types';
import { storage } from './utils';
import ChatScreen from './components/ChatScreen';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const userInfo = storage.get<UserInfo>(USER_INFO);
  return (
    <section className='w-[480px] h-full mx-auto flex flex-col py-4'>
      {userInfo ? <ChatScreen/> : <WelcomeScreen/>}
    </section>
  );
}

export default App;
