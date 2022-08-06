import React , {useState} from 'react';
import { USER_INFO } from '../constants';
import { FiUser } from 'react-icons/fi';
import { UserInfo } from '../types';
import { getId, storage } from '../utils';

const WelcomeScreen: React.FC = () => {
  const [userName, setUserName] = useState('');

  const changeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const setUserInfo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = userName.trim();
    if (!trimmed) return


    const userId = getId();

    storage.set<UserInfo>(USER_INFO, {userName: trimmed, userId});

    window.location.reload();
  };

  return(
    <section>
      <h1 className='title'>Welcome, friend!</h1>
      <form onSubmit={setUserInfo} className="flex flex-col items-center gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className='text-lg glex items-center justify-center'
          >
            <span className='mr-1'>
              <FiUser/>
            </span>
            <span>What is your name?</span>
          </label>
          <input
            type="text"
            id='username'
            name="userName"
            value={userName}
            onChange={changeUserName}
            required
            autoComplete='off'
            className="input"
          />
        </div>
        <button className="btn-success">Start chat</button>
      </form>
    </section>
  )
}

export default WelcomeScreen;
