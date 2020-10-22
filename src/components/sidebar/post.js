import { useRef, useEffect } from 'react';
import { cn } from "@bem-react/classname";
import NavLink from './NavLink';

const cnPost = cn("Link");

export default function Post({ route, level = 1, onClick, ...props }) {
  const selectedRef = useRef();
  const ref = route.selected ? selectedRef : null;

  useEffect(() => {
    if (ref && ref.current) {
      const content = document.querySelector('.Sidebar-Content');
      const height = ref.current.offsetTop - 32;

      content.scrollTop = height - content.offsetHeight / 2;
    }
  }, [ref]);

  return (
    <div ref={ref} className={cnPost({ level: `${level}` })}>
      <NavLink
        route={route}
        scrollSelectedIntoView={props.scrollSelectedIntoView}
        categorySelected={props.categorySelected}
        level={level}
        onClick={onClick}
      />
      <style jsx>{`
        .Link {
          margin: 18px 0 18px 1px;
          display: flex;
          align-items: center;
        }
        .Link:first-child {
          margin-top: 0;
        }
        .Link:last-child {
          margin-bottom: 0;
        }
        @media screen and (max-width: 950px) {
          .Link {
            margin: 24px 0;
          }
        }
      `}</style>
    </div>
  );
}
