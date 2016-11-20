An irc bot.

## Getting this to work (with VS Code)

1. Clone the repo
2. Install the npm packages `npm install`
3. Install nodejs typings `typings install dt~node --global --save`
4. Open the repo folder in VS Code
5. ctrl+shift+b and configure a Task Runner for TypeScript (tsconfig.json)
6. ctrl+shift+b to compile the TypeScript files
7. F5 to start debugging - choose NodeJS environment
8. Update the cwd key in launch.json: `"cwd": "${workspaceRoot}/src",`
9. Create an appConfig.json file in the src folder. See the provided file appConfig.json.example
10. F5 to start debugging