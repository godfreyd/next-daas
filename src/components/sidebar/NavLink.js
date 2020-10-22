import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from "@bem-react/classname";

const cnNavLink = cn("NavLink");

function NavLink({ route: { href, pathname, title, selected }, onClick }) {
  const router = useRouter();
  const onlyHashChange = pathname === router.pathname;

  return (
    <div className={cnNavLink({ selected })}>
      {
        // NOTE: use just anchor element for triggering `hashchange` event
        onlyHashChange ? (
          <a className={selected ? 'Link_selected' : ''} href={pathname}>
            {title}
          </a>
        ) : (
          <Link href={pathname || href}>
            <a onClick={onClick}>{title}</a>
          </Link>
        )
      }
      <style jsx>{`
        div.Link_selected {
          box-sizing: border-box;
        }
        .NavLink {
          display: flex;
        }
        .NavLink :global(a) {
          text-decoration: none;
          font-size: 1rem;
          line-height: 1.5rem;
          color: #444444;
          box-sizing: border-box;
        }
        .NavLink_selected :global(a) {
          font-weight: 600;
          color: red;
        }
        .NavLink:hover :global(a) {
          color: red;
        }
       
        span {
          color: #979797;
        }
      `}</style>
    </div>
  );
}

export default NavLink;
