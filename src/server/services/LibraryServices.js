const Queries = require('../models/queries');

class LibraryServices {
  static async getReserveListings() {
    const media = await Queries.getReservesByTerm('reserves');
    return media;
  }
}

module.exports = LibraryServices;
