const DeepLinkRoutes = () => {
  const { pathname, search } = window.location;
  window.location.href = `${
    process.env.NODE_ENV === 'development' ? 'exp://192.168.45.139:19000/--' : 'wagglewaggle:/'
  }${pathname ?? '/'}${search ?? ''}`;
  return <></>;
};

export default DeepLinkRoutes;
