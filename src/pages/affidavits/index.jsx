import React from 'react';
import Link from 'gatsby-link';
import { connect } from 'react-redux';

import AffidavitsList from './../../components/AffidavitsList';
import withRoot from '../../material-ui/withRoot';
import AnimateButton from '../../components/AnimateButton';
import BasicPage from './../../components/BasicPage';


const actions = (
  <Link to="/affidavits" style={{ textDecoration: 'none' }}>
    <AnimateButton variant="contained" color="primary" fullWidth size="large" text="Create Affidavit" />
  </Link>
)


/**
 * Presentational component for affidavit about page
 */
function AffidavitsPage({ affidavits, people }) {
  return (
    <BasicPage 
      actions={actions}
      back="/"
      title="Saved Affidavits"
      expanded="Affidavits"
      selected="View all affidavits"
    >
      <div>
        <AffidavitsList affidavits={affidavits} people={people} />
      </div>
    </BasicPage>
  )
}



const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  affidavits: state.affidavits,
  people: state.people,
  active: state.active,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  addAffidavit: () => dispatch(addAffidavitAction()),
  setAffidavit: id => dispatch(setActiveAffidavit(id)),
  deleteAffidavit: id => dispatch(destroyAffidavit(id)),
  setPerson: id => dispatch(setActivePerson(id)),
  changeAttribute: (id, attribute, value) => dispatch(changePersonAttribute(id, attribute, value)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withRoot(AffidavitsPage));