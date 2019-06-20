/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-octal-escape */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Spinner from './components/Spinner';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
}));

const Submit = () => {
  const classes = useStyles();

  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadFinished, setIsUploadFinished] = React.useState(false);
  const [uploadResult, setUploadResult] = React.useState({});
  const [error, setError] = React.useState(false);

  const sendRequest = (file, cb) => {
    const xhr = new window.XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        cb(xhr.response);
      }
    };

    const formData = new FormData();
    formData.append('file', file, file.name);

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };

  const handleOnChange = e => {
    setError(false);
    setIsUploading(true);
    sendRequest(e.target.files[0], data => {
      const json = JSON.parse(data);
      setIsUploading(false);
      if (json.hasOwnProperty('error')) {
        setError(json.error);
        return;
      }
      setUploadResult(json);
      setIsUploadFinished(true);
    });
  };

  let ErrorPanel;
  if (error) {
    ErrorPanel = <span className="error">{error}</span>;
  }

  let UploadPanel;
  if (!isUploadFinished && !isUploading) {
    UploadPanel = (
      <div>
        {ErrorPanel}
        <h2>Upload data</h2>
        <p>Select your CensusPlusClassic.lua (instruction see above)</p>
        <input
          accept=".lua"
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={handleOnChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span" className={classes.button}>
            Upload
            <CloudUploadIcon className={classes.rightIcon} />
          </Button>
        </label>
      </div>
    );
  }

  let SpinnerPanel;
  if (isUploading) {
    SpinnerPanel = (
      <div>
        <h2>Processing your data</h2>
        <p>Depending on your uploaded file size this may take a while</p>
        <Spinner width={200} height={200} />
      </div>
    );
  }

  let UploadFinishedPanel;
  if (isUploadFinished && Object.keys(uploadResult).length > 0) {
    UploadFinishedPanel = (
      <div>
        <h2 className="highlight">Thanks for submitting!</h2>
        <h3>Stats</h3>
        <p>New characters inserted: {uploadResult.charStats.inserted}</p>
        <p>Characters updated: {uploadResult.charStats.updated}</p>
        <p>Acitvity datasets inserted: {uploadResult.timeStats.inserted}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Data submission instructions</h1>
      <div className="box-wrapper normal">
        <h2>How to gather census data</h2>
        <ol>
          <li>
            Download{' '}
            <a
              href="https://github.com/christophrus/CensusPlusClassic/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              CensusPlusClassic
            </a>{' '}
            from Github
          </li>
          <li>
            Use an unzipping propram like{' '}
            <a href="https://www.7-zip.org/" target="_blank" rel="noopener noreferrer">
              7zip
            </a>{' '}
            and extract the CensusPlusClassic folder to your addons directory
          </li>
          <li>
            The beta addon directory is usually located here:
            <br />
            <strong>C:\Program Files\World of Warcraft\_classic_beta_\Interface\AddOns</strong>
          </li>
          <li>
            When you log into the game the CensusPlusClassic addon automatically starts gathering
            data. You can watch the progress through the minimap icon.
          </li>
          <li>
            After the census is taken you get a message in chat how many characters were recorded
          </li>
          <li>Logout or do a /reload to force the addon to write its data into the *.lua file</li>
          <li>
            Navigate to{' '}
            <strong>
              C:\Program Files\World of
              Warcraft\_classic_beta_\WTF\Account\1234567#1\SavedVariables\
            </strong>{' '}
            and find the <strong>CensusPlusClassic.lua</strong>{' '}
            <em>(1234567#1 is a different number for you or your account name)</em>
          </li>
          <li>
            Upload the <strong>CensusPlusClassic.lua</strong> through the upload button below
          </li>
        </ol>
      </div>
      <div className="box-wrapper normal upload">
        {SpinnerPanel}
        {UploadPanel}
        {UploadFinishedPanel}
      </div>
    </div>
  );
};

export default Submit;
