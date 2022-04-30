# nineP2k

## Getting started

### Install

```bash
$ npm i -g ninep2k
```

### Usage
```bash
$ nineP2k directory socket
$ nineP2k directory listen-address
$ nineP2k directory listen-address listen-port
```

### Implementing a File

```javascript
const File = require('ninep2k/fs/File').File;

class ExampleFile extends File
{}
```

### Implementing a Directory

```javascript
const Directory = require('ninep2k/fs/Directory').Directory;

class ExampleDirectory extends Directory
{}

```
