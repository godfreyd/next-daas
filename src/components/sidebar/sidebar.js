import { cn } from "@bem-react/classname";

const cnSidebar = cn("Sidebar");

export default function Sidebar({ active, children, fixed }) {

  return (
    <aside className={cnSidebar({ active, fixed})}>
      <div className={cnSidebar('Content')}>{children}</div>
      <style jsx>{`
        .Sidebar {
          background: #fff;
          padding-bottom: 40px;
          padding-right: 1.5rem;
          width: 300px;
          -webkit-overflow-scrolling: touch;
          flex-shrink: 0;
        }
        .Sidebar.Sidebar_fixed {
          position: sticky;
          top: 100px;
          margin-right: 1rem;
          height: calc(100% - 2rem - 81px - 50px);
        }
        .Sidebar-Content {
          overflow-y: auto;
          padding-bottom: 1.5rem;
        }
        @media screen and (max-width: 950px) {
          .Sidebar,
          .Sidebar.Sidebar_fixed {
            display: none;
          }
          .Sidebar.Sidebar_active {
            display: block;
          }
        }
      `}</style>
    </aside>
  );
}
