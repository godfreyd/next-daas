import React from "react";
import { cn } from "@bem-react/classname";
import Link from 'next/link';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';

const cnHeader = cn("Header");

const Header = ({ className }) => {
  return (
    <header className={cnHeader({ sticky: true }, [className])}>
      <div className={cnHeader("Main")}>
        <div className={cnHeader("Logo")}>
            <Link href="/">
                <a className="Logo" title="Go to the homepage">
                  Logo
                </a>
            </Link>
        </div>
        <div className={cnHeader("Left")}>
            <form  noValidate autoComplete="off">
                <TextField size="small" id="outlined-basic"  label="Поиск" variant="outlined" />
            </form>
        </div>
        <div className={cnHeader("Right")}>
        <Avatar alt="Remy Sharp" src="/images/avatar/user.jpg" />
        </div>
      </div>
      <style jsx>{`
        .Header {
            position: relative;
            z-index: 20;
          
            width: 100%;
          
            padding: 10px 20px;

            background: #fff;
            box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
          }

          .Header_sticky {
            position: sticky;
            top: 0;
          }

          .Header-Main {
            position: relative;
          
            display: flex;
            justify-content: space-between;
            align-items: center;
          
            height: 52px;
          }
          
          .Header-Logo {

          }
          
          .Header-Left {
           
          }
          
          .Header-Right {
            
          
          }
      `}</style>
    </header>
  );
};

export default Header;
