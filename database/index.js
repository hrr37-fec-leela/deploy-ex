const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017';
const dbName = 'under-armour';
var tableName = 'reviews';

var options = {
  useNewUrlParser: true,
};

const unique = {
  user: 1,
  pid: 1
};

var client = new MongoClient(uri, options);
var clearDatabase = function(callback) {
  client.connect((err, db)=> {
    db.db(dbName).collection(tableName).deleteMany( (err, resp)=> {
      if (callback) {
        callback(resp);
      }
      console.log('collection cleared');
    });
  });
};

var readCollection = (id, callback)=> {
  var query = [ {pid: {$eq: parseInt(id)}}, {pid: {$eq: String(id)}} ];
  client.connect((err, db)=> {
    const collection = db.db(dbName).collection(tableName);
    collection.find( {$or: query}).toArray((err, dbDocs)=> {
      if (err) {
        console.log(err, ' error reading')
        callback(true);
      } else {
        console.log('read successful');
        callback(err, dbDocs, client);
      }
    });
  });
};

var writeCollection_Array = (arrayOfObjects, id, callback)=> {
  client.connect(function(err, db) {
    const collection = db.db(dbName).collection(tableName);
    collection.insertMany(arrayOfObjects);
  });
};
var writeOnceToCollection = (obj, callback)=> {
  client.connect(function(err, db) {
    const collection = db.db(dbName).collection(tableName);
    collection.createIndex(unique, {unique: true});
    collection.insertOne( obj, (err)=> {
      if ( err ) {
        console.log(err)
        callback(err, client);
      } else if (callback) {
        callback(err, client);
      }
    });
  });
};

var sortCollection = (list)=> {
  return list.sort((a, b)=> {
    return b.timestamp - a.timestamp;
  });
};

var avgStatsCollection = (list) => {
  var avg = {
    size: 0,
    performance: 0,
    comfort: 0,
    stars: 0,
    histoStars: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  };

  var outcomes = 0;
  var maxFound  = [0, 0]

  for (var obj of list ) {
    avg.size += !parseFloat (obj.sizePurchased) ? 0 : parseFloat(obj.sizePurchased);
    avg.performance += !parseFloat (obj.performanceRating) ? 0 : parseFloat( obj.performanceRating);
    avg.comfort += !parseFloat (obj.comfortRating) ? 0 : parseFloat (obj.comfortRating);
    if (!((obj.stars) === NaN) && (obj.stars)) {
      avg.histoStars[obj.stars] += +( parseInt(obj.stars) !== 0);
      outcomes++;
    }
  }

  avg.size = avg.size / list.length;
  avg.performance = avg.performance / list.length;;
  avg.comfort = avg.comfort /  list.length;;

  for (var key in avg.histoStars ) {
    avg.histoStars[key] = Math.round( (avg.histoStars[key]/outcomes)*100 ) ;

    if (avg.histoStars[key]  >  maxFound[1]) {
      maxFound = [key, avg.histoStars[key]];
    }

    avg.stars = maxFound[0]; // update with largest average
  }
  return avg;
};

var updateCollection = (query, data, callback)=> {
  var set = {
    $set: data
  };
  client.connect ((err, db)=>{
    db.db(dbName).collection(tableName).update(query, set, (err)=> {
      if (err) {
        callback(true);
      } else {
        callback(null);
      }
    });
  });
};

exports.accessHelpers = {
  readCollection,
  writeCollection_Array,
  clearDatabase,
  writeOnceToCollection,
  sortCollection,
  updateCollection,
  avgStatsCollection
};