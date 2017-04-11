# comment-filter
Comment filter is a simple project that filters out given file line by line, and then tokenizes each line into sentences to search for a word. If a word is found in the sentence, it is put into the output file as a new line.

## Usage
You can run this script using `node index.js`. However you need to set some command line arguments for it to run.
### Arguments
- **in** the input file to process line by line.
- **out** the output file to put the output to.
- **key** the word to search for in the file.
- **override** if it this option is given, the output file will be overriden.

## Example
- Input File
```
Orange tree. Cherry. Orange.
Antalya.
That is a place where orange grows
```
- Command: `node index.js --in input.txt --out output.txt --override --key orange`
- Output file
```
Orange tree.
Orange.
That is a place where orange grows
```
