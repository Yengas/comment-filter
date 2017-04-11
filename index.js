const fs = require('fs'),
    byline = require('byline'),
    filter = require('stream-filter'),
    through = require('through2'),
    Tokenizer = require('sentence-tokenizer'),
    argv = require('yargs').argv;

const tokenizer = new Tokenizer('Test');
const inStream = fs.createReadStream(argv.in, { encoding: 'utf8' });
const outStream = fs.createWriteStream(argv.out, { flags: argv.override ? 'w' : 'a', encoding: 'utf-8' });

function matchString(line, word){
	return line.includes(argv.key);
}

function transform(line, word){
  tokenizer.setEntry(line.toString());

  return tokenizer
     .getSentences()
     .filter(line => matchString(line, word))
     .map(line => line + "\r\n")
     .join('');
}

byline(inStream)
  .pipe(filter(line => matchString(line, argv.key)))
  .pipe(through(function(line, _, cb){ this.push(transform(line, argv.key)); cb(); }))
  .pipe(outStream);
