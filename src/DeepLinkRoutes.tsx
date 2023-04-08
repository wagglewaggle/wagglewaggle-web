const DeepLinkRoutes = () => {
  const { pathname, search } = window.location;
  window.location.href = `wagglewaggle:/${pathname ?? '/'}${search ?? ''}`;
  return <></>;
};

export default DeepLinkRoutes;
