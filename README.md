# Task processor
Runner for background and cli tasks with SASS/CommonJS bundlers using native multithreading

## How to install
```bash
npm i -D @n1k1t/task-processor
```
or
```bash
yarn add -D @n1k1t/task-processor
```

## How to: `Do first steps`
1. Create `.js` executable file for tasks
2. Register task
```js
const { registerCliTasks } = require('@n1k1t/task-processor');

/*
  Tasks which you are going to use from command line should be registered 
  with the "registerCliTasks" function
*/
registerCliTasks([
  {
    name: 'greeting',
    use: [
      { processor: 'middleware', fn: () => console.log('Hi there!') }
    ]
  }
]);
```
3. Run it from console
```bash
node #your script
```
4. Type `greeting` in the console
5. Check the message from middleware "Hi there!" in the console 
6. Done!

## `Methods`
...comming soon

## `Processors`
...comming soon

## How to: `Watch and bundle of SASS`
```js
const { registerBackgroundTasks } = require('@n1k1t/task-processor');

/*
  The "registerBackgroundTasks" with the "watch" option is for tasks 
  which should watch some files for change and run automatically
*/
registerBackgroundTasks([
  {
    name: 'css',
    watch: { match: 'path/to/src/*.scss', ignore: ['_*.scss'] },
    use: [
      { processor: 'sass-bundle' },
      { processor: 'write-files', dir: 'path/to/dest' }
    ]
  }
]);
```

## How to: `Use Livereload for the dynamic injection of CSS`
1. First, you need install a livereload plugin for your browser. Here is the [Plugin for Google Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=ru)
2. Turn on the livereload plugin on the page which using bundled `sass` files
3. Write some code
```js
const { registerBackgroundTasks, useLivereload } = require('@n1k1t/task-processor');

/*
  The "useLivereload" creates a web socket server for integration with browser
  If you already have another process with the same server then it creates the client
  which will integrate with the first one
*/
useLivereload();

registerBackgroundTasks([
  {
    name: 'css',
    watch: { match: 'path/to/src/*.scss', ignore: ['_*.scss'] },
    use: [
      { processor: 'sass-bundle' },
      { processor: 'write-files', dir: 'path/to/dest' },
      { processor: 'livereload', type: 'inject' }
    ]
  }
]);
```

## How to: `Bundle of several SASS files with multithreading`
```js
const { registerCliTasks, useThreads } = require('@n1k1t/task-processor');

/*
  NOTE!!!
  
  The "useThreads" function creates workers each CPUs count in your system

  The "execPath" argument should contain the path to module where tasks are registred. 
  It's important because workers have different processes. 
  And that's not possible to forward functions with some lexical environment or closure to another process
*/
useThreads({ execPath: module.filename });

registerCliTasks([
  {
    name: 'css',
    description: 'This task gets all SASS files in "path/to/src" and bundles they to "path/to/dest"',
    add: { path: 'path/to/src/*.scss', ignore: ['_*.scss'] },
    use: [
      { processor: 'sass-bundle' },
      { processor: 'write-files', dir: 'path/to/dest' }
    ]
  }
]);
```

## How to: `Bundle Common JS`
```js
const { registerBackgroundTasks } = require('@n1k1t/task-processor');

registerBackgroundTasks([
  {
    name: 'js',
    watch: 'path/to/src/app.js',
    use: [
      { processor: 'commonjs-bundle' },
      { processor: 'write-files', dir: 'path/to/dest' }
    ]
  }
]);
```

## How to: `Watch for several files change but bundle only one`
```js
const { registerBackgroundTasks, useLivereload } = require('@n1k1t/task-processor');

useLivereload();

registerBackgroundTasks([
  {
    name: 'js',
    watch: { 
      match: 'path/to/src/**/*.js', 
      triggerOnly: true // This option wont pass changed file to the task context
    },
    use: [
      { processor: 'get-files', path: 'path/to/main/file.js' },
      { processor: 'commonjs-bundle' },
      { processor: 'write-files', dir: 'path/to/dest', name: 'app' },
      { processor: 'livereload', type: 'reload' } // Use type "reload" it for the page refreshing
    ]
  }
]);
```

## TODO
1. Add plugins support