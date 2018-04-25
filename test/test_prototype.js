function Animal(name) {
    this.name = name;
}

function Dog(name, age) {
    Animal.call(this, name);
    this.age = age;
}

Dog.prototype.say = function () {
    console.log(`${this.name}喊： 汪汪汪`);
};

let animal = new Animal('xulu');
let dog = new Dog(34, 23);

console.log(dog);

// new相当于以下三步
let xulu = {};
xulu.__proto__ = Dog.prototype;
xulu.__proto__.sleep = function () {
    console.log('sleeping!')
};
let obj = Dog.call(xulu, 'xulu', 23);
if(typeof obj === 'object') {
    xulu = obj;
}

console.log(xulu.__proto__.constructor.name);

console.log(xulu);
// xulu.say();
// xulu.sleep();

console.log.apply(console, Object.keys(xulu));
console.log(Object.keys(xulu));


function F(){}
F.prototype.fa1 = "fa1";
let f = new F();
console.log(F.fa1);
console.log(f.fa1);
console.log(f.__proto__.fa1);

f.__proto__ = F.prototype;
F.__proto__.fal = Function.prototype.fal;


