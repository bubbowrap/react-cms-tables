import Navigation from './Navigation';
import classes from './Header.module.css';

const Header = () => {
  return (
    <header className={classes.header}>
      <div className={classes['l-container']}>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
