import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Footer from '../../components/Footer/Footer';

import './Guide.scss';
import 'highlight.js/styles/xcode.css';

class Guide extends Component {
  constructor(props) {
    super(props);

    this.injectEditSection = this.injectEditSection.bind(this);
    this.buildMetaSection = this.buildMetaSection.bind(this);

    this.updateTocAnchors = _.throttle(this.updateTocAnchors.bind(this), 500);
  }

  componentDidMount() {
    this.injectEditSection();
    this.buildMetaSection();

    this.updateTocAnchors();
  }

  componentDidUpdate() {
    this.updateTocAnchors();
  }

  updateTocAnchors() {
    const selfDOM = ReactDOM.findDOMNode(this);
    if (!selfDOM) {
      console.warn('Failed to find the DOM.'); // eslint-disable-line
      return;
    }

    const tocAnchors = selfDOM.querySelectorAll('.table-of-contents li a');
    if (tocAnchors.length === 0) {
      console.warn('Cannot find any TOC anchors'); // eslint-disable-line
      return;
    }

    let currentLocation;
    try {
      currentLocation = document.location.href;
    } catch (e) {
      // skip, maybe it is under server rendering
      return;
    }

    // mark the selected anchor to active
    let foundAnchor = false;
    for (let idx = 0; idx < tocAnchors.length; idx++) {
      const anchor = tocAnchors.item(idx);
      if (anchor.href === currentLocation) {
        anchor.classList.add('active');
        foundAnchor = true;
      } else {
        anchor.classList.remove('active');
      }
    }
    if (!foundAnchor) {
      tocAnchors[0].classList.add('active');
    }
  }

  /*
   * This method trys to find the table of contents renderred by the markdown
   * ToC plugin and inject the edit section as its sibling.
   */
  injectEditSection() {
    const { editButtonOnClick } = this.props;

    const selfDOM = ReactDOM.findDOMNode(this);
    if (!selfDOM) {
      console.warn('Failed to find the DOM.'); // eslint-disable-line
      return;
    }

    const tocNode = selfDOM.querySelector('.table-of-contents');
    if (!tocNode) {
      console.warn('Cannot find the table of contents DOM');  // eslint-disable-line
      return;
    }

    try {
      // prevent duplication
      const oldEditSection = selfDOM.querySelector('.edit-section');
      if (oldEditSection) {
        oldEditSection.parentNode.removeChild(oldEditSection);
      }

      const tipElem = document.createElement('span');
      tipElem.appendChild(
        document.createTextNode(
          'Find some minor issues? You can edit this doc here.'
        )
      );

      const editButton = document.createElement('button');
      editButton.appendChild(document.createTextNode('Edit'));
      if (editButtonOnClick) {
        editButton.addEventListener('click', editButtonOnClick);
      }

      const editSection = document.createElement('section');
      editSection.classList.add('edit-section');
      editSection.appendChild(tipElem);
      editSection.appendChild(editButton);

      tocNode.parentNode.insertBefore(editSection, tocNode.nextSibling);
    } catch (e) {
      // skip, maybe it is under server rendering
      return;
    }
  }

  /*
   * This method extracts the table of contents and edit section and wrap them
   * with a container, namely meta section.
   */
  buildMetaSection() {
    const selfDOM = ReactDOM.findDOMNode(this);
    if (!selfDOM) {
      console.warn('Failed to find the DOM.'); // eslint-disable-line
      return;
    }

    try {
      if (selfDOM.querySelector('.meta-section')) {
        // already exist
        return;
      }
      const tocSection = selfDOM.querySelector('.table-of-contents');
      if (!tocSection) {
        console.warn('Cannot find the table of contents DOM');  // eslint-disable-line
        return;
      }

      const metaSection = document.createElement('section');
      metaSection.classList.add('meta-section');
      tocSection.parentNode.insertBefore(metaSection, tocSection);

      metaSection.appendChild(tocSection);

      const editSection = selfDOM.querySelector('.edit-section');
      if (editSection) {
        metaSection.appendChild(editSection);
      }
    } catch (e) {
      // skip, maybe it is under server rendering
      return;
    }
  }

  render() {
    const { title, docHtml } = this.props;
    return (
      <div className="guide">
        <h1 className="guide-header">{title}</h1>
        <div
          className="guide-content"
          dangerouslySetInnerHTML={{ __html: docHtml }}
        />
        <Footer />
      </div>
    );
  }
}

Guide.propTypes = {
  title: PropTypes.string,
  docHtml: PropTypes.string,
  editButtonOnClick: PropTypes.func,
};

export default Guide;
