const fs = require('fs');
const readline = require('readline');
const replace = require('replace-in-file');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let completed = false;
const parameters = {};

console.log('====================');
console.log('React Kindling Setup');
console.log('====================');
console.log('Press ^C to abort at any time.\n');

const doSetup = () => {
  // === README ===
  fs.unlinkSync('README.md');
  fs.renameSync('README.template.md', 'README.md');

  const projectFiles = ['src/**/*', 'LICENSE', 'package-lock.json', 'package.json', 'README.md'];
  // === GitHub project name ===
  replace.sync({
    files: projectFiles,
    from: /react-kindling/g,
    to: parameters.projectName,
  });
  // === Project title ===
  replace.sync({
    files: projectFiles,
    from: /React Kindling/g,
    to: parameters.projectTitle,
  });
  // === Project description ===
  replace.sync({
    files: projectFiles,
    from: /This header will contain a brief description of the project\./g,
    to: parameters.description,
  });
  // === Website or GitHub profile link ===
  replace.sync({
    files: projectFiles,
    from: /https:\/\/devboldly.com/g,
    to: parameters.website,
  });
  // === Email ===
  replace.sync({
    files: projectFiles,
    from: /devboldly@gmail\.com/g,
    to: parameters.email,
  });
  // === Author name ===
  replace.sync({
    files: projectFiles,
    from: /DevBoldly/g,
    to: parameters.author,
  });
  // === GitHub username ===
  replace.sync({
    files: projectFiles,
    from: /devboldly/g,
    to: parameters.githubUsername,
  });

  // === Self destruct ===
  // Remove setup npm script
  const scriptPattern = /\s*"setup": "node setup.js",/g;
  const scriptOptions = {
    files: ['package.json'],
    from: scriptPattern,
    to: '',
  };
  replace.sync(scriptOptions);
  // Remove replacement tool
  const replaceInFilePattern = /\s*"replace-in-file": ".*?",/g;
  const replaceInFileOptions = {
    files: ['package.json'],
    from: replaceInFilePattern,
    to: '',
  };
  replace.sync(replaceInFileOptions);
  // Remove setup script file
  try {
    fs.unlinkSync('setup.js');
  } catch (err) {
    console.error(err);
  }
  // We're done!
  completed = true;
};

// This header will contain a brief description of the project.

const projectNamePrompt = callback => {
  rl.question('GitHub project name (i.e. my-project): ', function(projectName) {
    if (projectName.trim() === '') {
      projectNamePrompt(callback);
    } else {
      callback(projectName);
    }
  });
};
const projectTitlePrompt = callback => {
  rl.question('Project title (i.e. My Project): ', function(projectTitle) {
    if (projectTitle.trim() === '') {
      projectTitlePrompt(callback);
    } else {
      callback(projectTitle);
    }
  });
};
const descriptionPrompt = callback => {
  rl.question('Project description: ', function(description) {
    if (description.trim() === '') {
      descriptionPrompt(callback);
    } else {
      callback(description);
    }
  });
};
const websitePrompt = callback => {
  rl.question('Website or GitHub profile link: ', function(website) {
    if (website.trim() === '') {
      websitePrompt(callback);
    } else {
      callback(website);
    }
  });
};
const emailPrompt = callback => {
  rl.question('Email (i.e. devboldly@gmail.com): ', function(email) {
    if (email.trim() === '') {
      emailPrompt(callback);
    } else {
      callback(email);
    }
  });
};
const authorPrompt = callback => {
  rl.question('Author name (i.e. Justin Mahar): ', function(author) {
    if (author.trim() === '') {
      authorPrompt(callback);
    } else {
      callback(author);
    }
  });
};
const githubUsernamePrompt = callback => {
  rl.question('GitHub username (i.e. devboldly): ', function(githubUsername) {
    if (githubUsername.trim() === '') {
      githubUsernamePrompt(callback);
    } else {
      callback(githubUsername);
    }
  });
};
const reviewPrompt = () => {
  const confirmation =
    `\n\nReview:\n-------\n` +
    `Project name: ${parameters.projectName}\n` +
    `Title:        ${parameters.projectTitle}\n` +
    `Description:  ${parameters.description}\n` +
    `Website:      ${parameters.website}\n` +
    `Email:        ${parameters.email}\n` +
    `Author:       ${parameters.author}\n` +
    `GitHub user:  ${parameters.githubUsername}\n\n` +
    `Look good (yes/no)? `;
  rl.question(confirmation, function(response) {
    if (response.toLowerCase() === 'y' || response.toLowerCase() === 'yes') {
      try {
        doSetup();
      } catch (e) {
        console.error(e);
      }
      rl.close();
    } else if (response.toLowerCase() === 'n' || response.toLowerCase() === 'no') {
      rl.close();
    } else {
      reviewPrompt();
    }
  });
};

projectNamePrompt(function(projectName) {
  parameters.projectName = projectName;
  projectTitlePrompt(function(projectTitle) {
    parameters.projectTitle = projectTitle;
    descriptionPrompt(function(description) {
      parameters.description = description;
      websitePrompt(function(website) {
        parameters.website = website;
        emailPrompt(function(email) {
          parameters.email = email;
          authorPrompt(function(author) {
            parameters.author = author;
            githubUsernamePrompt(function(githubUsername) {
              parameters.githubUsername = githubUsername;
              reviewPrompt();
            });
          });
        });
      });
    });
  });
});

rl.on('close', function() {
  if (completed) {
    console.log(
      '\nReact Kindling setup complete. Happy developing!\n' +
        'To reset all changes and start over, use:\n\n' +
        '  git reset HEAD --hard && npm run setup\n\n' +
        'Otherwise, to get started:\n\n' +
        '   React development:  npm start\n' +
        '  Docz documentation:  npm run docz\n'
    );
  } else {
    console.log('\nAborted.\n');
  }
  process.exit(0);
});
