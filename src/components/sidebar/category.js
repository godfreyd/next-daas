import { useRef, useState, useEffect } from 'react';
import { cn } from "@bem-react/classname";
import ArrowRightSidebar from '../icons/ArrowRightSidebar';

const cnCategory = cn("Category");

export default function Category({ level = 1, title, selected, opened, children }) {
  const ref = useRef();
  const [{ toggle, shouldScroll = false }, setToggle] = useState({ toggle: selected || opened });
  const toggleCategory = () => {
    setToggle({ toggle: !toggle, shouldScroll: true });
  };
  const levelClass = `Level-${level}`;

  useEffect(() => {
    if (selected) {
      setToggle({ toggle: true });
    }
  }, [selected]);

  useEffect(() => {
    if (toggle && shouldScroll) {
      const content = document.querySelector('.Sidebar-Content');

      const height = ref.current.offsetTop - (content.offsetTop);

      content.scrollTop = height;
      setToggle({ toggle });
    }
  }, [toggle, shouldScroll]);

  return (
    <div ref={ref} className={cnCategory({ open: toggle, selected }, [levelClass])}>
      <a className="Label" onClick={toggleCategory}>
        <ArrowRightSidebar fill="#999" />
        {title}
      </a>
      <div className="Posts">{children}</div>
      <style jsx>{`
        .Category {
          margin: 18px 0;
        }
        .Category:first-child {
          margin-top: 0;
        }
        .Category:last-child {
          margin-bottom: 0;
        }
        .Label {
          font-size: 1rem;
          line-height: 1.5rem;
          font-weight: 400;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #444444;
        }
        .Label > :global(svg) {
          margin-right: 3px;
          margin-left: -5px;
          transition: transform 0.15s ease;
        }
        .Category_selected > .Label {
          font-weight: 600;
          color: #000;
        }
        .Category_open > .Label {
          color: #000;
        }
        .Category_open > .Label > :global(svg) {
          margin-right: 3px;
          margin-left: -5px;
          transform: rotate(90deg);
        }
        .Level-2 .Label {
          text-transform: none;
          letter-spacing: 0;
        }
        .Label:hover {
          color: #000;
        }
        .Posts {
          margin-top: 0;
          height: 0;
          overflow: hidden;
          padding-left: 19px;
          margin-left: 3px;
        }
        .Category_open > .Posts {
          margin-top: 18px;
          height: auto;
        }

      `}</style>
    </div>
  );
}
