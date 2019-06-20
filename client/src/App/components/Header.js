import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Header.css';

const Header = props => {
  const {
    location: { pathname }
  } = props;

  return (
    <header>
      <div className="title">
        <Link className="title-link" to="./">
          wow<span>classic</span>population.<span>com</span>
        </Link>
      </div>
      <nav>
        <Link className={pathname === '/' ? 'active' : ''} to="./">
          Home
        </Link>
        <Link className={pathname === '/characters' ? 'active' : ''} to="./characters">
          Characters
        </Link>
        <Link className={pathname === '/activity' ? 'active' : ''} to="./activity">
          Activity
        </Link>
        <Link className={pathname === '/upload' ? 'active' : ''} to="./upload">
          Upload
        </Link>
      </nav>
    </header>
  );
};

export default withRouter(Header);
