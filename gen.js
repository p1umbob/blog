var fs = require("fs");
const fsp = fs.promises;

function main() {
  let res = "{";
  fsp
    .readdir("./node_modules")
    .then((dirs) => {
      const arr = dirs.map((dir) => {
        if (dir.indexOf(".") !== 0) {
          var packageJsonFile = "./node_modules/" + dir + "/package.json";
          if (fs.existsSync(packageJsonFile)) {
            return fsp.readFile(packageJsonFile).then((data) => {
              var json = JSON.parse(data);
              res += '"' + json.name + '": "' + json.version + '",';
              console.log('"' + json.name + '": "' + json.version + '",');
            });
          }
        }
      });
      return Promise.all(arr);
    })
    .then(() => {
      res += "}";
      fsp.writeFile("./out.json", res);
    });
}

main();
