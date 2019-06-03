import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { 
  fetchingSheet, 
  updatingSheet, 
  deletingSheet,
  toggleDebug
} from '../redux/actions';

import '../Document.scss';
import DocEditor from '../components/DocEditor';

class DocContainer extends Component {
  constructor(props) {
    super(props);
    this.titleField = React.createRef();
    this.state = {
      editingTitle: false
    }
  }

  componentDidMount() {
    const params = this.props.match.params;
    this.props.fetchingSheet(params.sheetId);
  }
  
  componentDidUpdate(prevProps, prevState) {
    const params = this.props.match.params;
    const prevParams = prevProps.match.params;

    if (prevParams.sheetId !== params.sheetId) {
      this.props.fetchingSheet(params.sheetId);
    }
  }

  handleTitleBlur = (e) => {
    this.setTitle(e.target.value);
    this.toggleEditTitle(false);
  }

  handleTitleKeyDown = (e) => {
    // detect 'enter' or 'esc' keypress
    if (e.which === 13 || e.which === 27) {
      this.setTitle(e.target.value);
      this.toggleEditTitle(false);
    }
  }

  handleEditTitle = (e) => {
    this.toggleEditTitle(true);
  }

  toggleEditTitle(flag = !this.state.editingTitle) {
    this.setState({editingTitle: flag}, () => {
      if (flag) this.titleField.current.focus();
    });
  }

  setTitle(title) {
    if (title !== this.props.sheet.title) {
      this.props.sheet.title = title;
      this.props.updateSheet(this.props.sheet);
    }
  }

  handleDelete = (e) => {
    this.props.deleteSheet(this.props.sheet);
    this.props.history.push('/');
  }

  handleDebug = (e) => {
    this.props.toggleDebug();
  }

  render() {
    const {sheet} = this.props;
    return (
      <div className="doc-page-container">
        {!sheet ? 
          <h3>Loading</h3> :
          <Fragment>
            <div className="doc-title-container">
              {this.state.editingTitle ?
                <div className="ui input">
                  <input type="text"
                    ref={this.titleField}
                    className="title-input"
                    defaultValue={sheet.title} 
                    onBlur={this.handleTitleBlur} 
                    onKeyDown={this.handleTitleKeyDown} />
                </div> :
                <div className="doc-title">
                  <h1 className="doc-title-heading"
                    onClick={this.handleEditTitle}>
                    {sheet.title}
                  </h1>
                  <div className="doc-title-actions">
                    <a className="doc-action edit-link"
                      onClick={this.handleEditTitle}
                      href="#">edit</a>
                    <a className="doc-action delete-link"
                      onClick={this.handleDelete}
                      href="#">delete</a>
                  </div>
                </div>
              }
            </div>
            <DocEditor sheet={sheet} />
          </Fragment>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    sheet: state.sheet
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fetchingSheet: (id) => {
      dispatch(fetchingSheet(id));
    },
    updateSheet: (sheet) => {
      dispatch(updatingSheet(sheet));
    },
    deleteSheet: (sheet) => {
      dispatch(deletingSheet(sheet));
    },
    toggleDebug: () => {
      dispatch(toggleDebug());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocContainer);
