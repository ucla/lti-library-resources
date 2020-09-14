const Queries = require('../models/queries');

class LibraryServices {
  static async getReserveListings() {
    const reserves = await Queries.getReservesByTerm('reserves');
    return reserves;
  }

  static async getCrosslists(shortname) {
    const crosslists = await Queries.getCrosslistsByShortname(
      'reserves',
      shortname
    );
    return crosslists;
  }

  static async getReserveUrl(shortname) {
    const reserve = await Queries.getReserveByShortname('reserves', shortname);
    return reserve;
  }
}

module.exports = LibraryServices;
