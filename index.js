const fs = require('fs'),
    byline = require('byline'),
    filter = require('stream-filter'),
    through = require('through2'),
    Tokenizer = require('sentence-tokenizer'),
    argv = require('yargs').argv;

const tokenizer = new Tokenizer('Test');
const outOptions = { flags: argv.override ? 'w' : 'a', encoding: 'utf-8' };
const outStream = fs.createWriteStream(argv.out, outOptions);
const filterStream = argv.filtered ? fs.createWriteStream(argv.filtered, outOptions) : null;
let inStream = fs.createReadStream(argv.in, { encoding: 'utf8' });

/**
 * Checks if the given line should be parsed, according to the given key.
 **/
function matchString(line, word){
	return line.includes(argv.key);
}

/**
 * Transforms a line of comment into multiple output arrays.
 * This arrays will hold the matched and filtered arrays of sentences.
 **/
function transform(line, word, splice){
  tokenizer.setEntry(line.toString());
  const matched = [], filtered = [];

  tokenizer
     .getSentences()
     .forEach(sentence => { 
       if(matchString(sentence, word))
         matched.push(sentence);
       // If we need the filtered outputs...
       else if(splice)
         filtered.push(sentence);
     });

  return [ matched, filtered ];
}

inStream = byline(inStream);
if(!argv.filtered)
  // If we don't need to print out the filtered version...
  inStream
    .pipe(filter(line => matchString(line, argv.key)))
    .pipe(through(function(line, _, cb){ 
      this.push(transform(line, argv.key, false)[0].map(sentence => sentence + "\r\n").join('')); 
      cb(); 
    }))
    .pipe(outStream);
else{
  inStream.on('data', (line) => {
   const outs = transform(line, argv.key, true); 

   // Put each filtered sentence as one line to the output file.
   outStream.write(outs[0].map(sentence => sentence + "\r\n").join(''));
   // Put the comment as a single line.
   filterStream.write(outs[1].join(' ') + "\r\n");
  });
}
