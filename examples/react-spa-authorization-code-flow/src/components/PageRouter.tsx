import { Switch, Route } from 'wouter'
import { Home } from '../pages/home'

export const PageRouter = () => (
  <Switch>
    <Route path="/" component={Home} />
  </Switch>
);
