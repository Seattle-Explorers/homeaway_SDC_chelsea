function writeToFile(writable, encoding, done) {
  let lines = 1000000;
  write();
  function write() {
    let okayToWrite = true;
    do {
      lines--;
      if (lines === 0) {
        writable.write(data, encoding, done);
      } else {
        okayToWrite = writable.write(data, encoding);
      }
    } while (lines > 0 && okayToWrite);
    if (lines > 0) {
      writable.once('drain', write);
    }
  }
}

module.exports = writeToFile;