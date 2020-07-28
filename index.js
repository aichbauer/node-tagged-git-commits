import execa from 'execa';
import isGit from 'is-git-repository';
import { platform } from 'os';
import makepath from 'path';
import pathIsAbsolute from 'path-is-absolute';
import shellescape from 'shell-escape';

const cwd = process.cwd();

// Escape bad arguments
var escapeShell = function(cmd) {
  if(cmd !== undefined){
    var arg = cmd.toString().split(" ");
    return shellescape(arg);
  }
}

const taggedGitCommits = ({ path, lookBehind, local, remote } = {}) => {
  let getCommits;

  let thisPath = path || cwd;
  thisPath = pathIsAbsolute(thisPath) ? thisPath : makepath.join(cwd, thisPath);
  const thisLookBehind = lookBehind || 1;
  const thisLocal = local === undefined ? true : local;
  const thisRemote = remote || 'origin';
  const taggedCommits = [];
  
  // escaping bad shell args
  thisPath = escapeShell(thisPath);
  thisLookBehind = escapeShell(thisLookBehind);
  thisLocal = escapeShell(thisLocal);
  thisRemote = escapeShell(thisRemote);

  if (!isGit(thisPath)) {
    return [];
  }

  try {
    let getTaggedCommitsExec;
    let getCommitsExec;

    if (thisLocal) {
      if (platform() === 'win32') {
        getCommitsExec = `pushd ${thisPath} & git show-ref`;
        getTaggedCommitsExec = `pushd ${thisPath} & git for-each-ref --format="%(*committerdate:raw)%(committerdate:raw) %(refname) %(*objectname) %(objectname)" refs/tags --sort=-v:refname | awk "{ print $4, $3; }"`;
      } else {
        getCommitsExec = `(cd ${thisPath} ; git show-ref)`;
        getTaggedCommitsExec = `(cd ${thisPath} ; git for-each-ref --format='%(*committerdate:raw)%(committerdate:raw) %(refname) %(*objectname) %(objectname)' refs/tags --sort=-v:refname | awk '{ print $4, $3; }')`;
      }

      getCommits = execa.shellSync(getCommitsExec).stdout;
    } else {
      if (platform() === 'win32') {
        getCommitsExec = `pushd ${thisPath} & git ls-remote ${thisRemote}`;
        getTaggedCommitsExec = `pushd ${thisPath} & git for-each-ref --format="%(*committerdate:raw)%(committerdate:raw) %(refname) %(*objectname) %(objectname)" refs/tags --sort=-v:refname --merged=${thisRemote} | awk "{ print $4, $3; }"`;
      } else {
        getCommitsExec = `(cd ${thisPath} ; git ls-remote)`;
        getTaggedCommitsExec = `(cd ${thisPath} ; git for-each-ref --format='%(*committerdate:raw)%(committerdate:raw) %(refname) %(*objectname) %(objectname)' refs/tags --sort=-v:refname --merged=${thisRemote} | awk '{ print $4, $3; }')`;
      }

      getCommits = execa.shellSync(getCommitsExec).stdout;
    }

    if (getCommits.includes('refs/tags')) {
      const getTaggedCommits = execa.shellSync(getTaggedCommitsExec).stdout;

      let taggedCommitsSimple = getTaggedCommits.split('\n');
      taggedCommitsSimple = taggedCommitsSimple.reverse();
      taggedCommitsSimple = taggedCommitsSimple.slice(-Math.abs(thisLookBehind));
      taggedCommitsSimple.forEach((taggedCommit) => {
        const commit = taggedCommit.split(' ')[0];
        const shortCommit = commit.substring(0, 7);
        const refsTags = taggedCommit.split(' ')[1];
        const version = refsTags.split('refs/tags/')[1];

        taggedCommits.push({
          commit,
          shortCommit,
          hash: commit,
          shortHash: shortCommit,
          version,
          refsTags,
        });
      });
    }

    return taggedCommits;
  } catch (e) {
    return [];
  }
};

export default taggedGitCommits;
