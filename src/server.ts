import fastify from "fastify";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import axios from "axios";
import { queryProductsAfterDate } from "./graphql/queries";
import { PRODUCT_HUNT_GRAPHQL_ENDPOINT } from "./utils";
import { Post } from "./interfaces";
import { formatProductsAndWriteToAirtable } from "./helpers";
import Airtable from "airtable";

dotenv.config();

export const database = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(`${process.env.AIRTABLE_BASE_ID}`);

const server = fastify();

server.get("/updateProducts", async (request, reply) => {
  try {
    // gets all products of the day
    const res = await axios.post(
      PRODUCT_HUNT_GRAPHQL_ENDPOINT,
      {
        query: queryProductsAfterDate(
          // this gets 24 hours ago, and this will be called at 3pm (EST) or 12pm (PST) everyday
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        ),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRODUCT_HUNT_DEVELOPER_TOKEN}`,
        },
      }
    );
    // get products from response
    const products: Post[] = res.data.data.posts.edges;

    // write to airtable
    const updateAirtable = await formatProductsAndWriteToAirtable(products);
    if (!updateAirtable.success) throw new Error(updateAirtable.error);

    return { success: true };
  } catch (err: any) {
    console.log(err.message);
    return reply.send({ error: err.message });
  }
});

server.listen({ port: 4000 });
