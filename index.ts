const inquirer = require('inquirer');

enum Frameworks {
  React = 'React',
  Next = 'Next',
  Node = 'Node',
  Electron = 'Electron',
}

interface Answer {
  framework: string;
}

inquirer
  .prompt([
    {
      type: 'list',
      message: 'Pick the framework you are using:',
      name: 'framework',
      choices: Object.values(Frameworks),
    },
  ])
  .then((answers: Answer) => {
    console.log(answers);
  })
  .catch((error: Error) => {
    console.log(error);
  });
