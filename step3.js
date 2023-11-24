const fs = require('fs');
const axios = require('axios');

function cat(path, out) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err}`);
      process.exit(1);
    }
    output(data, out);
  });
}

async function webCat(url, out) {
  try {
    const response = await axios.get(url);
    output(response.data, out);
  } catch (err) {
    console.error(`Error fetching ${url}:\n  ${err}`);
    process.exit(1);
  }
}

function output(text, out) {
  if (out) {
    fs.writeFile(out, text, 'utf8', err => {
      if (err) {
        console.error(`Couldn't write ${out}:\n  ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(text);
  }
}

// Corrected command-line arguments parsing
let outputPath, source;

if (process.argv[2] === '--out') {
  outputPath = process.argv[3]; // Output file path
  source = process.argv[4]; // Source file path or URL
} else {
  source = process.argv[2]; // Source file path or URL
}

if (source) {
  if (source.startsWith('http://') || source.startsWith('https://')) {
    webCat(source, outputPath);
  } else {
    cat(source, outputPath);
  }
} else {
  console.error("No source provided");
  process.exit(1);
}
