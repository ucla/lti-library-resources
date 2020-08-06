const Queries = require('../models/queries');

class LibraryServices {
  static async getReserveListings(term) {
    const media = await Queries.getReservesByTerm('reserves', term);
    return media;
  }
}

module.exports = LibraryServices;
