const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://afaris01:BellaGoodGirl123!@cluster0.slnx9.mongodb.net/";


client =new MongoClient(url);
async function findall () {
  try {
    await client.connect();
    var dbo = client.db("Recipes");
	  var coll = dbo.collection('User1');
    const options = {
       sort: { recipeName: 1 },
       projection: { _id: 0, recipeName: 1, cookingInstructions: 1 , ingredients: 1},
    };
   
    
    // console.log("Connected!");

    const result = coll.find({},options);
    // print a message if no documents were found
    if ((result.countDocuments) === 0) {
      console.log("No documents found!");
    }
    
	 await result.forEach(function(item){
		  console.log(item.recipeName);
		  console.log(item.ingredients);
		  console.log(item.cookingInstructions);
	  });
  } 
  catch(err) {
	  console.log("Database error: " + err);
}
  finally {
    client.close();
  }
}  //end findit
findall();//.catch(console.dir);



