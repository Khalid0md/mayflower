import { Post } from "../interfaces";
import { database } from "../server";

export const formatProductsAndWriteToAirtable = async (products: Post[]) => {
  try {
    // create array so we can send multiple create requests in parallel
    const writeMany: any = [];

    // format each product
    products.forEach(async (pro) => {
      const { topics, thumbnail, ...rest } = pro.node;

      // topics will have slash format ==> "AI/Marketing/Business/SaaS"
      let allTopics = ``;
      topics.edges.forEach((topic) => {
        // and we do slash format here
        allTopics = allTopics + `${!allTopics ? `` : "/"}${topic.node.name}`;
      });

      // throw product in a object to fit our airtable database schema
      const record = { ...rest, topics: allTopics, thumbnail: thumbnail.url };

      // HERE WE CHECK IF THIS PRODUCT'S ID ALREADY EXISTS IN OUR DATABASE
      const existingsRecords = await database(
        `${process.env.AIRTABLE_TABLE_ID}`
      )
        .select({ filterByFormula: `{id}="${rest.id}"` })
        .all();

      // the product DOESN'T exist, so we add it
      if (!existingsRecords.length)
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

export const acceptPostSubmission = async (submission: Post) => {
  //create an action on the submit button of the form
  //this action will trigger this function
  //this function should add the submission to a database of posts to be reviewed, database will be reviewed by admins and added in manually
  //this function should add the submission to a database of posts to be reviewed, 
  //that database should show on an administartor-only page on website, with ability to select posts
  //and press a button that makes API call to add them to database
};