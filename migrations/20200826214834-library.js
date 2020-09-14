module.exports = {
  async up(db) {
    const collectionList = await db.listCollections().toArray();
    if (!collectionList.map((col) => col.name).includes('reserves')) {
      await db.createCollection('reserves');
    }
    if (!collectionList.map((col) => col.name).includes('analytics')) {
      await db.createCollection('analytics');
    }
  },
  async down() {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
