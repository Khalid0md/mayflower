import { Post } from "../interfaces";
import { database } from "../server";

export const formatProductsAndWriteToAirtable = async (products: Post[]) => {
  try {
    // create array so we can send multiple create requests in parallel
    const writeMany: any = [];

    // format each product
    products.forEach((pro) => {
      const { topics, thumbnail, ...rest } = pro.node;

      // topics will have slash format ==> "AI/Marketing/Business/SaaS"
      let allTopics = ``;
      topics.edges.forEach((topic) => {
        // and we do slash format here
        allTopics = allTopics + `${!allTopics ? `` : "/"}${topic.node.name}`;
      });

      // throw product in a object to fit our airtable database schema
      const record = { ...rest, topics: allTopics, thumbnail: thumbnail.url };

      // push (unsent) request to array of requests
      writeMany.push(
        database(`${process.env.AIRTABLE_TABLE_ID}`).create({ ...record })
      );
    });

    // write all records simultaneously (send all requests in parallel)
    await Promise.all(writeMany);

    return { success: true };
  } catch (err: any) {
    console.log(`ERROR OCCURRED:`, err.message);
    return { error: err.message };
  }
};
