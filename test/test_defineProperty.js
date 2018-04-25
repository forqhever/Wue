let lulu = {
    name: 'fafa'
};

let value = lulu.name;
Object.defineProperty(lulu, 'name', {
    // enumerable: false,   // 默认是true
    configurable: false,    // 默认是true
    // writable: false,     // 默认是true，不能和getter、setter同时存在
    // get: function () {
    //     return value
    // },
    // set: function (val) {
    //     console.log(`set ${val}`)
    //     value = val;
    // }
});

// delete lulu.name;

lulu.name = 'xulu';
for(let key in lulu) {
    console.log(`${key} : ${lulu[key]}`)
}
console.log(Object.keys(lulu))
console.log(lulu.name);