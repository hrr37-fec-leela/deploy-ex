var faker = require('faker');
var db = require('../../database/index');
faker.seed(100);

var genPID = function() { //quiet for now
  return `pid_${faker.random.number({min: 1, max: 1000})}`;
};
var timeStamp = function() {
  result = '' + faker.random.number({min: 0, max: 1000});
  return result;
};

var genTestimonials = function(count, pid) {
  var storage = [];
  for (var i = 0; i < count; i++) {
    var obj = {};
    obj.height = `${faker.random.number({min: 5, max: 7})} '${faker.random.number({min: 0, max: 11})}"`;
    obj.athleteType = faker.random.arrayElement(['Avid', 'Casual', 'Professional']);
    obj.sportsInterest = faker.random.arrayElement(['Basketball', 'Soccer', 'Basball', 'Softball', 'Field Hockey', 'Football', 'Golf', 'Lacrosse', 'Rugby', 'Volleyball']);
    obj.gender = faker.random.arrayElement(['male', 'female']);
    obj.user = faker.name.firstName({male: 22});
    obj.date = faker.date.recent();
    obj.sizePurchased = faker.random.arrayElement(['XS', 'SM', 'MD', 'LG', 'XL', 'XXL', '3XL']);
    obj.performanceRating = faker.random.number({min: 0, max: 7});
    obj.comfortRating = faker.random.number({min: 0, max: 7});
    obj.sizeRating = faker.random.number({min: 0, max: 7});
    obj.stars = faker.random.number({min: 0, max: 5});
    obj.subject = faker.lorem.words()
    obj.review = faker.lorem.sentences(4);
    obj.picture = faker.image.sports(1, 100);
    obj.likes = [faker.random.number(100), faker.random.number(100)];
    obj.response = faker.lorem.sentences(4);
    obj.logoA = faker.image.technics();
    obj.logoB = faker.image.technics();
    obj.dislikes = [faker.random.number(100), faker.random.number(100)];
    obj.responseDate = faker.date.past();
    obj.timestamp = timeStamp();
    obj.pid = pid;
    storage.push(obj);
  }
  return storage;
};

var generateTable = function(callback) {
  const shoeCount = 100;  //max number of review pages
  var testimonial;
  var rand;

  for(var i = 0; i <= shoeCount; i++) {
    rand = faker.random.number({min: 5, max: 7});
    testimonial = genTestimonials(rand, i);
    db.accessHelpers.writeCollection_Array(testimonial, i , (err, msg, db)=> {
      if (err) {
        console.log('error');
      }
      db.close();
    });
  }
};

var run = function() {
  var close = () => {
    console.log('databased seeded!');
    // process.stdout.write('\x1Bc');
    console.log('Sorry for the logs, I will patch soon :)');
    process.exit();

  }
  console.log('Starting to seed');
  setTimeout(generateTable, 200);
  setTimeout( close , 5000);
  console.log('databased seeded!');
};

exports.accessHelpers = {
  run
};
