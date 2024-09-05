interface CRoute {
  path: string;
  name?: string;
  exact?: boolean | undefined;
  component?: any;
}

export default CRoute;
