/**
 * @param {Date} date
 */
export const queryProductsAfterDate = (date: Date) => `
  {
    posts(order: VOTES, topic: "artificial-intelligence", postedAfter: "${date}") {
      edges {
        node {
          id
          name
          website
          description
          votesCount
          createdAt
          tagline
          createdAt
          topics {
            edges {
              node {
                name
                id
              }
            }
          }
          thumbnail {
            url
          }
        }
      }
    }
  }
  
  `;
