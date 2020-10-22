import React from "react";
import { cn } from "@bem-react/classname";
import Link from 'next/link';
import TextField from '@material-ui/core/TextField';



const cnHeader = cn("Header");



const Header = ({ className }) => {
 
  return (
    <header className={cnHeader({ sticky: true }, [className])}>
      <div className={cnHeader("Container")}>
        <div className={cnHeader("Left")}>

            <Link href="/">
                <a className="Logo" title="Go to the homepage">
                Logo
                </a>
            </Link>
        </div>
        <div className={cnHeader("Search")}>
            <form  noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            </form>
        </div>
        <div className={cnHeader("Right")}>
          
            {
                // что-то
            }
        </div>
      </div>
      <style jsx>{`
        .Header {
            position: relative;
            z-index: 20;
          
            width: 100%;
          
            background: #fff;
            box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
          }

          .Header_sticky {
            position: sticky;
            top: 0;
          }

          .Header-Container {
            position: relative;
          
            display: flex;
            justify-content: space-between;
            align-items: center;
          
            height: 52px;
          
            margin: 15px 0;
          
            white-space: nowrap;
          }
          
          .Header-Left {
            display: flex;
            flex-grow: 1;
            flex-basis: 0;
            flex-shrink: 0;
            justify-content: flex-start;
            align-items: center;
          
            box-sizing: border-box;
            padding-right: 12px;
          
            font-size: 17px;
          
            opacity: 1;
          
            transition: opacity 0.3s cubic-bezier(0.36, 0.66, 0.04, 1);
          }
          
          .Header-Search {
            overflow: hidden;
          
            font-size: 21px;
            font-weight: 800;
            line-height: 52px;
            text-align: center;
            text-overflow: ellipsis;
          
            opacity: 1;
          
            transition: opacity 0.3s cubic-bezier(0.36, 0.66, 0.04, 1);
          }
          
          .Header-Right {
            display: flex;
            flex-grow: 1;
            flex-basis: 0;
            flex-shrink: 0;
            justify-content: flex-end;
            align-items: center;
          
            box-sizing: border-box;
            padding-left: 12px;
          
            font-size: 17px;
          
            opacity: 1;
          
            transition: opacity 0.3s cubic-bezier(0.36, 0.66, 0.04, 1);
          }
      `}</style>
    </header>
  );
};

export default Header;
