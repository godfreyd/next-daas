import PageContainer from './page-container';
import Header from './Header';

export default function Page({
  title,
  description = undefined,
  sticky = undefined,
  children,
  hideHeader,
  hideHeaderBorder = false
}) {
  return (
    <PageContainer title={title} description={description}>
      {!hideHeader && <Header />}
      {children}
    </PageContainer>
  );
}
