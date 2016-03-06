import React, { PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;
