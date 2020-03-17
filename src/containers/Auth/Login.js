import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Login from '../../components/Auth/Login';
import { logIn_ } from '../../store/actionCreators/authActions';

const mapStateToProps = state => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      logIn: (name, uniqueIdentifier) => logIn_(name, uniqueIdentifier)
    }
  )(Login)
);
