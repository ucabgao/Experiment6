import React, { PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import DevTools from './DevTools';

const App = ({children, location}) => {
  return (
    <div>
      <ReactCSSTransitionGroup
        component="div"
        transitionName={location.query.transition || 'none'}
        transitionEnterTimeout={150}
        transitionLeaveTimeout={150}>
        {React.cloneElement(children, {
          key: location.pathname
        })}
      </ReactCSSTransitionGroup>
      <DevTools />
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
