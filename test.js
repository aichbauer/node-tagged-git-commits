import fs from 'fs-extra';
import { homedir } from 'os';
import test from 'ava';
import path from 'path';

import taggedCommit from './index';

const fixtures = path.join(process.cwd(), 'test', 'fixtures');

test.before('rename git folders', () => {
  fs.renameSync(path.join(fixtures, 'local-tagged-3', 'git'), path.join(fixtures, 'local-tagged-3', '.git'));
  fs.renameSync(path.join(fixtures, 'local-tagged-0', 'git'), path.join(fixtures, 'local-tagged-0', '.git'));
  fs.renameSync(path.join(fixtures, 'remote-tagged-1', 'git'), path.join(fixtures, 'remote-tagged-1', '.git'));
});

test.after.always('rename .git folders', () => {
  fs.renameSync(path.join(fixtures, 'local-tagged-3', '.git'), path.join(fixtures, 'local-tagged-3', 'git'));
  fs.renameSync(path.join(fixtures, 'local-tagged-0', '.git'), path.join(fixtures, 'local-tagged-0', 'git'));
  fs.renameSync(path.join(fixtures, 'remote-tagged-1', '.git'), path.join(fixtures, 'remote-tagged-1', 'git'));
});

test('get the latest local tag', (t) => {
  t.deepEqual(taggedCommit({
    path: 'test/fixtures/local-tagged-3',
    lookBehind: 1,
  }),
    [{
      commit: 'af6919c58065af276780ebbb8f16b6cdadd2c17c',
      shortCommit: 'af6919c',
      hash: 'af6919c58065af276780ebbb8f16b6cdadd2c17c',
      shortHash: 'af6919c',
      version: 'v0.0.3',
      refsTags: 'refs/tags/v0.0.3',
    }],
  );
});

test('get the latest local tag without passing the lookBehind', (t) => {
  t.deepEqual(taggedCommit({
    path: 'test/fixtures/local-tagged-3',
  }),
    [{
      commit: 'af6919c58065af276780ebbb8f16b6cdadd2c17c',
      shortCommit: 'af6919c',
      hash: 'af6919c58065af276780ebbb8f16b6cdadd2c17c',
      shortHash: 'af6919c',
      version: 'v0.0.3',
      refsTags: 'refs/tags/v0.0.3',
    }],
  );
});

test('get the latest two local tags', (t) => {
  t.deepEqual(taggedCommit({
    path: 'test/fixtures/local-tagged-3',
    lookBehind: 2,
  }),
    [
      {
        commit: '76486fab54307f961ffa83c283f15f49adce30bb',
        shortCommit: '76486fa',
        hash: '76486fab54307f961ffa83c283f15f49adce30bb',
        shortHash: '76486fa',
        version: 'v0.0.2',
        refsTags: 'refs/tags/v0.0.2',
      },
      {
        commit: 'af6919c58065af276780ebbb8f16b6cdadd2c17c',
        shortCommit: 'af6919c',
        hash: 'af6919c58065af276780ebbb8f16b6cdadd2c17c',
        shortHash: 'af6919c',
        version: 'v0.0.3',
        refsTags: 'refs/tags/v0.0.3',
      },
    ],
  );
});

test('get the latest three local tags', (t) => {
  t.deepEqual(taggedCommit({
    path: 'test/fixtures/local-tagged-3',
    lookBehind: 3,
  }),
    [
      {
        commit: '31107b9051efe17e57c583937e027993860b11a9',
        shortCommit: '31107b9',
        hash: '31107b9051efe17e57c583937e027993860b11a9',
        shortHash: '31107b9',
        version: 'v0.0.1',
        refsTags: 'refs/tags/v0.0.1',
      },
      {
        commit: '76486fab54307f961ffa83c283f15f49adce30bb',
        shortCommit: '76486fa',
        hash: '76486fab54307f961ffa83c283f15f49adce30bb',
        shortHash: '76486fa',
        version: 'v0.0.2',
        refsTags: 'refs/tags/v0.0.2',
      },
      {
        commit: 'af6919c58065af276780ebbb8f16b6cdadd2c17c',
        shortCommit: 'af6919c',
        hash: 'af6919c58065af276780ebbb8f16b6cdadd2c17c',
        shortHash: 'af6919c',
        version: 'v0.0.3',
        refsTags: 'refs/tags/v0.0.3',
      },
    ],
  );
});

test('get an emty array if local repo has no tags', (t) => {
  t.deepEqual(taggedCommit({
    path: 'test/fixtures/local-tagged-0',
    lookBehind: 3,
  }), []);
});

test('get an emty array if the directory is not a repo', (t) => {
  t.deepEqual(taggedCommit({
    path: homedir(),
    lookBehind: 3,
  }), []);
});

test('get tags from remote repository', (t) => {
  t.deepEqual(taggedCommit({
    path: 'test/fixtures/remote-tagged-1',
    local: false,
    remote: 'origin/master',
  }),
    [
      {
        commit: '31107b9051efe17e57c583937e027993860b11a9',
        shortCommit: '31107b9',
        hash: '31107b9051efe17e57c583937e027993860b11a9',
        shortHash: '31107b9',
        version: 'v0.0.0',
        refsTags: 'refs/tags/v0.0.0',
      },
    ],
  );
});
