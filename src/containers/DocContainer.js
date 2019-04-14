import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { 
  fetchingDocument, 
  updatingDocument, 
  deletingDocument,
  toggleDebug
} from '../redux/actions';

import '../Document.scss';
import DocEditor from '../components/Editor';

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
    this.props.fetchingDocument(params.docId);
  }
  
  componentDidUpdate(prevProps, prevState) {
    const params = this.props.match.params;
    const prevParams = prevProps.match.params;

    if (prevParams.docId !== params.docId) {
      this.props.fetchingDocument(params.docId);
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
    if (title !== this.props.doc.title) {
      this.props.doc.title = title;
      this.props.updateDocument(this.props.doc);
    }
  }

  handleDelete = (e) => {
    this.props.deleteDocument(this.props.doc);
    this.props.history.push('/');
  }

  handleDebug = (e) => {
    this.props.toggleDebug();
  }

  render() {
    const {doc} = this.props;
    return (
      <div className="doc-page-container">
        {!doc ? 
          <h3>Loading</h3> :
          <Fragment>
            <div className="doc-title-container">
              {this.state.editingTitle ?
                <div className="ui input">
                  <input type="text"
                    ref={this.titleField}
                    className="title-input"
                    defaultValue={doc.title} 
                    onBlur={this.handleTitleBlur} 
                    onKeyDown={this.handleTitleKeyDown} />
                </div> :
                <div className="doc-title">
                  <h1 className="doc-title-heading"
                    onClick={this.handleEditTitle}>
                    {doc.title}
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
            <DocEditor doc={doc} />
          </Fragment>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    doc: state.document
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fetchingDocument: (id) => {
      dispatch(fetchingDocument(id));
    },
    updateDocument: (doc) => {
      dispatch(updatingDocument(doc));
    },
    deleteDocument: (doc) => {
      dispatch(deletingDocument(doc));
    },
    toggleDebug: () => {
      dispatch(toggleDebug());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocContainer);