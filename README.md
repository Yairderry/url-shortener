# ![Scale-Up Velocity](./readme-files/logo-main.png) Final 1 - URL shortner 📎

In this project you will create your own [URL shortener](https://en.wikipedia.org/wiki/URL_shortening)!

This repository includes a basic template for starting the project:

## Instructions

- Fork this repository to your account as a **public** repo
- Clone your new repository to your computer 🖥
- Install the project dependencies by running `npm install` from the vscode terminal `ctrl + j` (make sure you are in the correct directory) 📂
- [Create a new branch](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/managing-branches) for the development process
- Make changes to the code to meet the project requirements 📝
- [Commit Early, Push Often](https://www.worklytics.co/commit-early-push-often/) - your work will be evaluated by your git flow and overall github usage 🏄‍♂️
- Before submitting, create a pull request from the development branch into the main branch. **Leave the PR open and do not merge the branches**. The open PR will be used to review and mark your code
- Good Luck! 🤘

## Testing your project

In this assignment, you will have to create your own tests, as learned in class. Your grade will be calculated by your test coverage.

Optionally, You can create a github [action](https://docs.github.com/en/actions) that runs your tests on each commit:

![Commits test](./readme-files/commit-tests.png)

## Guidelines

- Create a route `/api/shorturl/` in your `express` app that will handle all url shortening requests. (We recommend using [express Router](https://expressjs.com/en/guide/routing.html))

- Write/read **Asynchronously** a single JSON file as your DB

- [Serve](https://expressjs.com/en/starter/static-files.html) your client files from your server at route `/`

- Style and change your front-end as you wish. You can take inspiration from this [example](https://www.shorturl.at/)

## Requirements

- Examine thoroughly and copy all functionality of [this](https://url-shortener-microservice.freecodecamp.rocks/) FCC example

- Use a `class DataBase{}` to read/write (**Asynchronously**) all data in your back-end (you can use a json file as persistent layer)

- Add another functionality to your service: a statistics route (`api/statistic/:shorturl-id`) that will respond with the following data per `shorturl-id`:
  - `creationDate` - a SQLDate format
  - `redirectCount` - the amount of times this url was used for redirection
  - `originalUrl`
  - `shorturl-id`

- Fully test your `express` app with `jest` and `supertest`. Test each end point response **including** error responses.

  Use a separate DB file for your tests. _Hint: use [Environment variables](https://jestjs.io/docs/en/environment-variables)_

## Bonus

- Add any feature you desire. Some ideas worth extra points:
  - Custom short URL. Support optional `shorturl-id` parameter in your `POST` request. Pay attention to error handling.
  - Serve a styled statistics dashboard instead of the default JSON statistics
  - Use the [`JSONBIN.io`](https://jsonbin.io/) service bin as your persistent layer in your back-end DB class (use CRUD operations to read write bins)
  - Try implementing user management
- Use supertest/puppeteer test to test any bonus feature you implemented

**Add an explanation in `README.md` for each bonus feature you add and a link to any resource you used**

## Grading policy

- Using jsonbin.io with/instead of writing to files
- Correct DB class usage
- Code quality and style: indentation, Meaningful and non-disambiguate variable names, Comments and documentation, file and directory structure
- Visual creativity, style your front-end to make it look awesome 💅🏿
- Division to reusable functions, no code duplication
- Git usage: meaningful commit messages, small commits, folder and file structures, README file, issues, etc...

## Submitting
- Submit your solution repo link - an open PR from your dev branch to the main one
- Your readme should have a [`repl.it`](https://repl.it/) link with your solutions.
- Submit a link to your repo to the CRM.

GOOD LUCK!
