const fs = require('fs');
const path = require('path');

function updateEnvValue(envPath, variable, value) {
  const filePath = path.resolve(__dirname, envPath);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const newContent = fileContent.replace(new RegExp(`${variable}=.*`), `${variable}=${value}`);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Updated ${variable} in ${envPath} to ${value}`);
}

// Set IS_DEV values
const setDevMode = (isDev) => {
  updateEnvValue('./functions/.env', 'IS_DEV', isDev ? 'true' : 'false');
  updateEnvValue('./Front/.env', 'REACT_APP_IS_DEV', isDev ? 'true' : 'false');
};

// Parse command-line arguments
const mode = process.argv[2];
if (mode === 'true' || mode === 'false') {
  setDevMode(mode === 'true');
} else {
  console.log("Please specify 'true' or 'false'");
  process.exit(1);
}
