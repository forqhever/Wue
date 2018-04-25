class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    constructor(name, age) {
        super(name);
        this.age = age;
    }
}

let animal = new Animal('xulu');

let dog = new Dog('xulu', 23);
console.log(Dog.prototype.constructor);

for(let key in animal) {
    if(animal.hasOwnProperty(key)) {
        console.log(key);
    }
}

for(let key in dog) {
    if(dog.hasOwnProperty(key)) {
        console.log(key);
    }
}
