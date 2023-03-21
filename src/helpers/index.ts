import { Post } from "../interfaces";
import { database } from "../server";

export const formatProductsAndWriteToAirtable = async (products: Post[]) => {
  try {
    //? why don't we send a create request with one array? because limited to array of 10 items?
    // create array so we can send multiple create requests in parallel
    const writeMany: any = [];

    //retrieve {id} = records and delete them all with destroy, for each
    //retrieve records, compare them to products, only create ones that are unique to products, destroy ones that are not in products
    let recArr: any = [];
  await Promise.resolve(database(`${process.env.AIRTABLE_TABLE_ID}`).select({

    }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        console.log('Retrieved', record.get('name'));
        recArr.push(record.id);
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
    console.log(recArr);
}));
    

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

      // clear database

      // push (unsent) request to array of requests
      // writeMany.push(
      //   database(`${process.env.AIRTABLE_TABLE_ID}`).create({ ...record })
      // );
    });

    // write all records simultaneously (send all requests in parallel)
    // await Promise.all(writeMany);

    return { success: true };
  } catch (err: any) {
    console.log(`ERROR OCCURRED:`, err.message);
    return { error: err.message };
  }
};
