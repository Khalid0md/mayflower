require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_PAT}).base(process.env.AIRTABLE_BASE_ID);

const query = `
  {
    posts(first: 10, order: VOTES, topic: "artificial-intelligence") {
      edges {
        node {
          name
          website
          description
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
            'Authorization': process.env.PH_API_KEY
        },
        body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(response => response.data.posts.edges)
        .catch(error => console.error('Error fetching data from Product Hunt:', error));
    return res;
}

const updateTable = async (arra) => {
  // inlcude media in query, slice media array into 1 and use that as the logo
  base('site-content').create(arra, function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function(record) {
      console.log(record.get('name'));
    });
  });
}


(async() => {
    let arr = await request();
    console.log(arr);
    const dataArr = [];
    //write a function that populates an airtable base through post request(s), the fewer the better
    let i = 62;
    for (item of arr) {
        //put the node in each item in a new arrays
        dataArr.push({fields: item.node});
        //I need an array of objects, each object has string keys and string values
        i++;
    }
    console.log(dataArr);

    //pass dataArr into the updateTable method
    await updateTable(dataArr);
  })();

  