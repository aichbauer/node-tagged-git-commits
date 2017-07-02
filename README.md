# tagged-git-commits

Get the commit hash and refs/tags of tagged commits, remote and local

[![Build Status](https://travis-ci.org/aichbauer/node-tagged-git-commits.svg?branch=master)](https://travis-ci.org/aichbauer/node-tagged-git-commits)
[![Build status](https://ci.appveyor.com/api/projects/status/f6bdyd0afwg1p36a?svg=true)](https://ci.appveyor.com/project/rudolfsonjunior/node-tagged-git-commits)
[![Coverage Status](https://coveralls.io/repos/github/aichbauer/node-tagged-git-commits/badge.svg?branch=master)](https://coveralls.io/github/aichbauer/node-tagged-git-commits?branch=master)

## Installation

```sh
$ npm i tagged-git-commits --save
```
or
```sh
$ yarn add tagged-git-commits
```

## Usage

```js
const taggedCommits = require('tagged-git-commits');

// the latest local tagged commit from process.cwd()
taggedCommits();

// the latest local tagged commit from the repo './path/to/repo'
taggedCommits({
  path: './path/to/repo',
});

// the latest 5 local tagged commits from process.cwd()
taggedCommits({
  lookBehind: 5,
});

// the latest tagged commit from process.cwd() from remote origin
taggedCommits({
  local: false,
});

// the latest tagged commit from process.cwd() from remote anotherOrigin
taggedCommits({
  local: false,
  remote: 'anotherOrigin'
});

// the latest 3 tagged commits from the repo './path/to/repo' from the remote origin
taggedCommits({
  path: './path/to/repo',
  lookBehind: 3,
  local: false,
  remote: 'origin',
});
```

Returns an object.

```js
{
  commit: '31107b9051efe17e57c583937e027993860b11a9',
  shortCommit: '31107b9',
  hash: '31107b9051efe17e57c583937e027993860b11a9',
  shortHash: '31107b9',
  version: 'v1.0.0',
  refsTags: 'refs/tags/v1.0.0'
}
```

## LICENSE

MIT © Lukas Aichbauer
