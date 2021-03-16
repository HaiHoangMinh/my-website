const fs = require('fs'); // xu ly file stream
const util = require('util'); // module checking data with asyc - promise

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile); // use promise to read file

/**
 * Logic for fetching speakers information
 */
class SpeakerService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the speakers data
   */
  constructor(datafile) {
    this.datafile = datafile; //function init
  }

  /**
   * Returns a list of speakers name and short name
   */
  async getNames() {
    const data = await this.getData();

    // We are using map() to transform the array we get into another one
    return data.map((speaker) => {
      return { name: speaker.name, shortname: speaker.shortname }; //  chuyen doi mang thanh truong khac
    });
  }

  /**
   * Get all artwork
   */
  async getAllArtwork() {
    const data = await this.getData();

    // Array.reduce() is used to traverse all speakers and - duyet list data
    // create an array that contains all artwork
    // khoi tao list cac project cua tung speakers
    const artwork = data.reduce((acc, elm) => {
      if (elm.artwork) {
        // eslint-disable-next-line no-param-reassign
        acc = [...acc, ...elm.artwork];
      }
      return acc;
    }, []);
    return artwork;
  } // => list cac project (artwork) cua cac speakers

  /**
   * Get all artwork of a given speaker
   * lay thong tin cac project cua 1 object qua shortname
   * @param {*} shortname The speakers short name
   */
  async getArtworkForSpeaker(shortname) {
    const data = await this.getData();
    // tim kiem thong qua shortname (ham tu viet)
    const speaker = data.find((elm) => {
      return elm.shortname === shortname;
    });
    if (!speaker || !speaker.artwork) return null;
    return speaker.artwork;
  }

  /**
   * Get speaker information provided a shortname
   * Lay thong tin speakers thong qua shortname
   * @param {*} shortname
   */
  async getSpeaker(shortname) {
    const data = await this.getData();
    const speaker = data.find((elm) => {
      return elm.shortname === shortname;
    });
    if (!speaker) return null;
    return {
      title: speaker.title,
      name: speaker.name,
      shortname: speaker.shortname,
      description: speaker.description,
    };
  } // tra ve thong tin speaker

  /**
   * Returns a list of speakers with only the basic information
   * tra ve toan bo list speakers voi thong tin co ban
   */
  async getListShort() {
    const data = await this.getData();
    return data.map((speaker) => {
      return {
        name: speaker.name,
        shortname: speaker.shortname,
        title: speaker.title,
      };
    });
  }

  /**
   * Get a list of speakers
   * Lay thong tin toan bo list speakers voi toan bo thong tin
   */
  async getList() {
    const data = await this.getData();
    return data.map((speaker) => {
      return {
        name: speaker.name,
        shortname: speaker.shortname,
        title: speaker.title,
        summary: speaker.summary,
      };
    });
  }

  /**
   * Fetches speakers data from the JSON file provided to the constructor
   * Lay thong tin speakers tu file json
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    return JSON.parse(data).speakers;
  }
}

module.exports = SpeakerService;
