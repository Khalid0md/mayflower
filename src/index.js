require('dotenv').config();

const query = `
  {
    posts(first: 10, order: VOTES, topic: "artificial-intelligence") {
      edges {
        node {
          name
          description
          website
          reviewsRating
          votesCount
        }
      }
    }
  }
`;

const request = async () => {
    const res = await fetch('https://api.producthunt.com/v2/api/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.API_KEY
        },
        body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(response => response.data.posts.edges)
        .catch(error => console.error('Error fetching data from Product Hunt:', error));
    return res;
}


(async() => {
    const arr = await request();
    console.log(arr);
    //write a function that populates an airtable base through post request(s), the fewer the better
    for (item of arr) {
        console.log(`\n${JSON.stringify(item)}`)
    }
  })();

  