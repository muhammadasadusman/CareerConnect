require("dotenv").config();

const mongoose = require("mongoose");

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const client = mongoose.connection.getClient();

    const sourceDB = client.db("test");
    const targetDB = client.db("careerconnect");

    const collections = [
      "users",
      "jobs",
      "companies",
      "applications",
      "savedjobs",
    ];

    for (const collectionName of collections) {
      const sourceCollection = sourceDB.collection(collectionName);
      const targetCollection = targetDB.collection(collectionName);

      const data = await sourceCollection.find({}).toArray();

      console.log(
        `${collectionName}: found ${data.length} documents`
      );

      if (data.length === 0) {
        continue;
      }

      const existing = await targetCollection.countDocuments();

      if (existing > 0) {
        console.log(
          `${collectionName}: target already has ${existing} documents, skipping`
        );
        continue;
      }

      await targetCollection.insertMany(data);

      console.log(
        `${collectionName}: migrated ${data.length} documents ✅`
      );
    }

    console.log("\nMigration completed successfully 🎉");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Migration failed ❌");
    console.error(error);
    process.exit(1);
  }
};

migrate();