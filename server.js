//variable declarations to import the http module, fs module and url module
const http = require('http'),
  fs = require('fs'),
  url = require('url');

http.createServer((request, response) => { //http module calls the createServer function which has yet another function with two arguments(request,response) which are passed into createServer each time an HTTP request is made against that server
  let addr = request.url, //new variable "addr" is declared and assigned the function request.url. This allows you to get the URL from the "request" of createServer() function 
    q = url.parse(addr, true), //variable q is assigned the parse() function from url module using dot notation and passes two arguments(addr,true)
    filePath = ''; //variable filePath is declared, but it's set to an empty string. This will be where you store the path of the file;

    //The appendFile(); function takes three arguments: the file name in which you want to append your new information, the new information to be appended, 
     //and an error-handling function. This means that the new information you're including in the second argument will be appended at the end of the “log.txt” file.
     //the information that's being appended: a log of the URL that was entered and the date/time stamp when request was made. 
     //The addr variable is the URL that the user entered where let addr = request.url is used to get the request URL, while the new Date() function grabs the current time
  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {  
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

   //First is the statement that checks what the exact pathname of the entered URL is: q.pathname.includes('documentation').
   //q is where you stored the parsed URL from your user. dot notation is being used to access the pathname of q. pathname is the part that comes immediately after the first “/” in the URL
   //If pathname includes 'documentation', it pieces together __dirname and “/documentation.html”, adding them as a complete path name to the currently empty filePath
   //If not it returns index.html
   if (q.pathname.includes('documentation')) { 
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

   //fs module uses its readfile() function (again, accessed via dot notation) to grab the appropriate file from the server. 
   //the first argument given to it is the filePath variable with the full pathname of the URL you fetched and parsed! 
   //This way we used the http module to set up the server, url module to grab and read a URL request sent by the user, then the fs module to send back the appropriate file.
  fs.readFile(filePath, (err, data) => {  //then the callback function passes two additional arguments, err and data, where err is an error object and data is the contents of the file.
    if (err) {
      throw err;
    }

    //adds a header to the response that will be returned (along with the HTTP status code “200” for OK)
    response.writeHead(200, { 'Content-Type': 'text/html' }); //'Content-Type' provides the client with the actual content type of the returned content.
    response.write(data); //Displays the contents of the file
    response.end();

  });

}).listen(8080); //http server listens for requests on port 8080
console.log('My test server is running on Port 8080.');