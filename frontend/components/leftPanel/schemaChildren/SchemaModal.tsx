import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
// import GenerateData from './GenerateData';

const { dialog } = require('electron').remote;
const { ipcRenderer } = window.require('electron');

type ClickEvent = React.MouseEvent<HTMLElement>;

type SchemaModalProps = {
  tabList: string[];
  show: boolean;
  showModal: any;
  onClose: any;
};

type state = {
  schemaName: string;
  schemaFilePath: string;
  schemaEntry: string;
  redirect: boolean;
  dbCopyName: string;
  copy: boolean;
};

class SchemaModal extends Component<SchemaModalProps, state> {
  constructor(props: SchemaModalProps) {
    super(props);
    this.handleSchemaSubmit = this.handleSchemaSubmit.bind(this);
    this.handleSchemaFilePath = this.handleSchemaFilePath.bind(this);
    this.handleSchemaEntry = this.handleSchemaEntry.bind(this);
    this.handleSchemaName = this.handleSchemaName.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
    this.handleCopyData = this.handleCopyData.bind(this);
    this.dropDownList = this.dropDownList.bind(this);
    this.handleCopyFilePath = this.handleCopyFilePath.bind(this);

    // this.handleQueryPrevious = this.handleQueryPrevious.bind(this);
    // this.handleQuerySubmit = this.handleQuerySubmit.bind(this);
  }

  state: state = {
    schemaName: '',
    schemaFilePath: '',
    schemaEntry: '',
    redirect: false,
    dbCopyName: 'Select Instance',
    copy: false,
  };

  // Set schema name
  handleSchemaName(event: any) {
    // convert input label name to lowercase only with no spacing to comply with db naming convention.
    const schemaNameInput = event.target.value;
    let dbSafeName = schemaNameInput.toLowerCase();
    dbSafeName = dbSafeName.replace(/[^A-Z0-9]/gi, '');
    this.setState({ schemaName: dbSafeName });
  }

  // Load schema file path
  // When file path is uploaded, query entry is cleared.
  handleSchemaFilePath(event: ClickEvent) {
    event.preventDefault();

    dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Custom File Type', extensions: ['tar', 'sql'] }],
        message: 'Please upload .sql or .tar database file',
      })
      .then((result: object) => {
        const filePath = result['filePaths'];
        this.setState({ schemaFilePath: filePath });
        const schemaObj = {
          schemaName: this.state.schemaName,
          schemaFilePath: this.state.schemaFilePath,
          schemaEntry: '',
        };
        if (!result['canceled']) {
          ipcRenderer.send('input-schema', schemaObj);
          this.setState({ schemaName: '' });
        }
        this.setState({ dbCopyName: 'Select Instance' });
        this.props.showModal(event);
      })

      .catch((err: object) => {
        console.log(
          'Error in handleSchemaFilePath method of SchemaModal.tsx.',
          err
        );
      });
  }

  // When schema script is inserted, file path is cleared set dialog to warn user.
  handleSchemaEntry(event: any) {
    this.setState({ schemaEntry: event.target.value, schemaFilePath: '' });
  }

  handleSchemaSubmit(event: any) {
    event.preventDefault();

    const schemaObj = {
      schemaName: this.state.schemaName,
      schemaFilePath: this.state.schemaFilePath,
      schemaEntry: this.state.schemaEntry,
    };
    ipcRenderer.send('input-schema', schemaObj);
  }

  selectHandler = (eventKey, e: React.SyntheticEvent<unknown>) => {
    this.setState({ dbCopyName: eventKey }); //
  };

  handleCopyData(event: any) {
    if (!this.state.copy) this.setState({ copy: true });
    else this.setState({ copy: false });
  }

  dropDownList = () => {
    return this.props.tabList.map((db, index) => (
      <Dropdown.Item key={index} eventKey={db} className="queryItem">
        {db}
      </Dropdown.Item>
    ));
  };

  handleCopyFilePath(event: any) {
    event.preventDefault();
    const schemaObj = {
      schemaName: this.state.schemaName,
      schemaFilePath: '',
      schemaEntry: '',
      dbCopyName: this.state.dbCopyName,
      copy: this.state.copy,
    };

    ipcRenderer.send('input-schema', schemaObj);
    this.setState({ dbCopyName: `Select Instance` });
    this.setState({ schemaName: '' });
    this.props.showModal(event);
  }

  render() {
    if (this.props.show === false) {
      return null;
    }

    return (
      <div className="modal" id="modal">
        <h3>Enter New Schema Name (required): {this.state.schemaName}</h3>
        <input
          className="schema-label"
          type="text"
          placeholder="Input New Schema Name..."
          onChange={(e) => this.handleSchemaName(e)}
        />

        <div className="load-schema">
          <h3>Upload New Schema:</h3>
          <div className="modal-buttons">
            <button id="load-button" onClick={this.handleSchemaFilePath}>
              Select File
            </button>
          </div>
        </div>
        <br />
        <div className="separator">OR</div>
        <br />
        <div className="copy-instance">
          <h3>Copy Existing Schema: </h3>
          <Dropdown id="select-dropdown" onSelect={this.selectHandler}>
            <Dropdown.Toggle>{this.state.dbCopyName}</Dropdown.Toggle>
            <Dropdown.Menu>{this.dropDownList()}</Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="data-checkbox">
          <p title="Do not check box if you'd like a shell copy of an existing DB">
            With Data?
          </p>
          <input
            id="copy-data-checkbox"
            type="checkbox"
            name="Data"
            onClick={this.handleCopyData}
          ></input>
          <button
            id="copy-button"
            className="modal-buttons"
            onClick={this.handleCopyFilePath}
          >
            Make Copy
          </button>
        </div>

        <button
          className="close-button"
          onClick={() => {
            this.props.onClose();
            this.setState({ dbCopyName: 'Select Instance' });
            this.setState({ schemaName: '' });
          }}
        >
          X
        </button>
      </div>
    );
  }
}

export default SchemaModal;
