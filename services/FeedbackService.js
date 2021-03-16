const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

/**
 * Logic for reading and writing feedback data
 */
class FeedbackService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the feedback data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Get all feedback items
   */
  async getList() {
    const data = await this.getData(); // xuat taon bo list data [object] ...
    return data;
  }

  /**
   * Add a new feedback item
   * @param {*} name The name of the user
   * @param {*} title The title of the feedback message
   * @param {*} message The feedback message
   */
  // Them feedback moi
  async addEntry(name, email, title, message) {
    const data = (await this.getData()) || [];
    data.unshift({ name, email, title, message }); // add data in queue (day vao cuoi mang).
    return writeFile(this.datafile, JSON.stringify(data)); // chuyen object thanh strinh r ghi ra file json
  }

  /**
   * Fetches feedback data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8'); // doc file json vao data
    if (!data) return []; // file empty => return object rong
    return JSON.parse(data); // parse data sang object r tra ve result
  }
}

module.exports = FeedbackService;
