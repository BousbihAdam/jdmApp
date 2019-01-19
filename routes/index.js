var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require("request");

const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

/*
var mongoDB = 'mongodb://adam:Adam1995@ds161224.mlab.com:61224/jeuxdemots';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function (){ console.log("Connexion à la base OK"); });


var termSchema = new mongoose.Schema({}, { strict: false });
var TermMongoose = mongoose.model('termes', termSchema);
*/

const fetch = require("node-fetch");
let htmlparser = require("htmlparser2");

router.get('/:word', function(req, res, next) {

    let word = req.params.word;
    cacheResult = myCache.get( word );

    if ( cacheResult == undefined ){   
        console.log("querying ! no cache is found");
      /*  TermMongoose.findOne({id: word}, function (err, resp) {  
            if(resp != undefined){
                console.log("serving from database ");
                let e = JSON.stringify(resp, null, '\t');
                console.log(e['result']);
                res.json(e);
                
            }
            else{
        */
    var options = {
            "url":"http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel="+word,
            "method": "get",
            "encoding": "latin1"
    };
    request(options, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        let data = body.substring(body.indexOf("<def>"));

        let result = {};
       
        //The definitions
        result.definitions = data.substring(data.indexOf("<def>"), data.indexOf("</def>")).replace(/<(?:.|\n)*?>/gm, '');
      
    
       
        
      //  console.log("The definitions \n ");
       // console.log(result.definitions);
 
        let indexOfNodesStart = data.indexOf("// les noeuds/termes (Entries) : e;eid;'name';type;w;'formated name'");
        let indexOfRelationsTypes = data.indexOf("// les types de relations (Relation Types) : rt;rtid;'trname';'trgpname';'rthelp'");

        let nodes = data.substring(indexOfNodesStart,indexOfRelationsTypes);
     //   console.log("Les noeuds \n");
    //    console.log(nodes);
  
    //    console.log("\n \n");
      //  console.log("********************************************************************");
        //Our start point is the relations types
        data = data.substring(indexOfRelationsTypes);

        //We retreive the relations types 
        let indexOfIncomingRelations = data.indexOf("// les relations entrantes : r;rid;node1;node2;type;w");  
        let indexOfOutgoingRelations = data.indexOf("// les relations sortantes : r;rid;node1;node2;type;w");
        let relationsTypesList = data.substring(0, indexOfOutgoingRelations).split("\n");
        console.log("relationsTypesList \n");
      //  console.log(relationsTypesList);
        console.log("\n \n");
        // We define the relations that we'll use
  
        //i = 2 since  relationsTypesList contains 2 empty elements
        // rt;rtid;'trname';'trgpname';'rthelp'
        result.relations ={};
        for (let i = 2; i < relationsTypesList.length - 2; i++) {
            let tokens = relationsTypesList[i].split(';');
            // relation id and name 
            let rtid = tokens[1];
            let trname = tokens[2].replace(/[^\w\s]/gi, ''); 
            let rthelp = tokens[4]; 
            result.relations[rtid] = {"trname" : trname, "outgoing" : "", "incoming" : "","rthelp": rthelp}; 
        }
         //phrase.replace(/dog/g, '')
      //  console.log(result.relations);

        let outgoingRelations = data.substring(indexOfOutgoingRelations,indexOfIncomingRelations);
        outgoingRelations = outgoingRelations.substring(outgoingRelations.indexOf('r;', outgoingRelations.indexOf('r;')+1));
        let i = outgoingRelations.indexOf('\n');
        while(i != -1){
            // relation = r;rid;node1;node2;type;w"
            let relation = outgoingRelations.substring(0, i).split(';');
            // relation [4] is the relation type 
           // console.log("relation [4]");
           // console.log(relation[4]);
            if(relation[4] in result.relations){
                //termname from nodes
                let termName = nodes.substring(nodes.indexOf("e;" + relation[3]));
                tokens = termName.split(";");
                // nodes : e;eid;'name';type;w;'formated name
                termName = tokens[2].replace(/[^\w\s]/gi, ''); ;
                termName = "<a href=/"+termName +">"+termName+"</a>";
                
                result.relations[relation[4]].outgoing = result.relations[relation[4]].outgoing + termName + ", ";
            }
            outgoingRelations = outgoingRelations.substring(i + 1);
            i = outgoingRelations.indexOf('\n');


        }
   
        let incomingRelations = data.substring(indexOfIncomingRelations, data.indexOf('// END'));
        incomingRelations = incomingRelations.substring(incomingRelations.indexOf('r;', incomingRelations.indexOf('r;')+1));
        let j = incomingRelations.indexOf('\n');
        while(j != -1){
            // relation = r;rid;node1;node2;type;w"
            let relation = incomingRelations.substring(0, j).split(';');
            // relation [4] is the relation type 
            if(relation[4] in result.relations){
                //termname from nodes
                let termName = nodes.substring(nodes.indexOf("e;" + relation[2]));
                tokens = termName.split(";");
                // nodes : e;eid;'name';type;w;'formated name
                termName = tokens[2].replace(/[^\w\s]/gi, ''); 
                termName = "<a href=/"+termName +">"+termName+"</a>";
                
                result.relations[relation[4]].incoming = result.relations[relation[4]].incoming + termName + ", ";
            }
            incomingRelations = incomingRelations.substring(j + 1);
            j = incomingRelations.indexOf('\n');


        }

        saveCache = myCache.set( word, result, 10000 );
        /*
        result.id = {"id": word};
        console.log(result.id);
        var termMongoose = new TermMongoose({ result });
        termMongoose.save(function(err){
            if(err){
              console.log(err);
            }
            console.log("Terme ajouté à la base");
          });
        */
        res.json(result);

    });
  /* 
} 
});*/
  
}else{
    console.log("serving from cache");
    res.json(cacheResult);
}

 

});
 

module.exports = router;
