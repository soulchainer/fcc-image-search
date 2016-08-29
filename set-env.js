function setEnvVariables(app) {
  var env = app.settings.env;
  if (env === 'production') {
    return;
  }

  var config = require('./.env')[env];

  for (key in config) {
    process.env[key] = config[key];
  }
}

module.exports = setEnvVariables;
