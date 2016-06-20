/**
 * Created by wk on 5/30/16.
 */
var fs = require("fs");
var traverse = require('traverse');
var parser = require('xml2json');
var formidable = require("formidable");


function start(response) {
    console.log("Request handler 'start' was called.");

    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<label>This is the first page</label><br/>'+
        '<label>For upload xml</label><br/>'+
        '<label>After upload , click upload</label><br/>'+
        '<form action="/upload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="file" name="upload" multiple="multiple">'+
        '<input type="submit" value="for test xml input" />'+
        '</form>'+
        '<br/>'+

        '<hr>'+
        '<script type="text/javascript">'+
        'if (window.File && window.FileReader && window.FileList && window.Blob) {'+
        '/*alert(\'support\')*/'+
        '} else {'+
        'alert(\'The File APIs are not fully supported in this browser.\');'+
        '}</script>'+
        '<form action="/xmlload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="file" id="files" name="files[]" multiple="multiple" hidden>'+
        '<output id="list"></output>'+
        '<script>'+
        'function handleFileSelect(evt) {'+
        '       var files = evt.target.files; '+
        '       console.log(files);'+
        '       var output = [];'+
        '       for (var i = 0, f; f = files[i]; i++) {'+
        '           output.push(\'<li><strong>\', escape(f.name), \'</strong> (\', f.type || \'n/a\', \') - \','+
        '               f.size, \' bytes, last modified: \','+
        '               f.lastModifiedDate.toLocaleDateString(), \'</li>\');'+
        '       }'+
        '       console.log(output);'+
        '       document.getElementById(\'list\').innerHTML = \'<ul>\' + output.join(\'\') + \'</ul>\';'+
        '   }'+
        ''+
        '   document.getElementById(\'files\').addEventListener(\'change\', handleFileSelect, false);'+
        '</script>'+
        '<input type="submit" value="for test link jump" />'+
        '</form>'+

        '</body>'+
        '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}


function upload(response, request) {
    console.log("Request handler 'upload' was called.");
/*
    xmlhttp=new XMLHttpRequest();


    xmlhttp.open("GET","test.xml",false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
*/
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        fs.renameSync(files.upload.path, "/tmp/test.xml");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received data:<br/>");
        response.write("<a href='/showxml2json'>show xml2json</a>");
        response.write("<br/>");
        //response.write("<a href='/showtraverse'>show traverse</a>");
        //response.write("<img src='/show' />");
        //response.write("<lable>test</lable>")
        response.end();
    });

}

function xmlload(response, request) {

    var xml = "<foo>bar</foo>";
    console.log(xml);
    var json = parser.toJson(xml); //returns a string containing the JSON structure by default
    console.log(json);

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
         console.log("parsing done");
        console.log(files);
        console.log(files.upload);
         console.log(files.upload.path);
         fs.renameSync(files.upload.path, "/tmp/test.xml");
         response.writeHead(200, {"Content-Type": "text/html"});
         response.write("received data:<br/>");
         response.write(json);
         //response.write("<img src='/show' />");
         //response.write("<lable>test</lable>")
         response.end();
    });
/*
    var data = {};
    readFiles('dirname/',function (filename, content) {
        data[filename] = content;
    },function(error){
        throw err;
    });
*/

}

function readFiles(dirname, onFileContent, onError){
    fs.readdir(dirname,function(err,filenames) {
        if(err){
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(dirname+filename,'utf-8', function(err, content){

                if(err){
                    onError(err);
                    return;
                }
                onFileContent(filename,content);

            });
        });
    });
}


function show(response) {
    console.log("Request handler 'show' was called.");
    fs.readFile("/tmp/test.xml", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            var json = parser.toJson(file); //returns a string containing the JSON structure by default
            //console.log(json);
            var leaves = traverse(json).reduce(function (acc, x) {
                if (this.isLeaf) acc.push(x);
                return acc;
            }, []);

            console.dir(leaves);

            response.write(json);

            response.end();
        }
    });
}


function showxml2json(response,request,postData) {
    console.log("Request handler 'show' was called.");

    fs.readFile("/tmp/test.xml", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            console.log("trasform from xml to JSON: start");
            var json = parser.toJson(file); //returns a string containing the JSON structure by default
            console.log("trasform from xml to JSON: end");
            //console.log(json);
            var leaves = traverse(json).reduce(function (acc, x) {
                if (this.isLeaf) acc.push(x);
                return acc;
            }, []);

            var treatJS = treatJson(json);

            /*
            console.log(treatJS[0][0]);
            console.log(treatJS[0][1]);
            console.log(treatJS[0][2]);
            console.log(treatJS[0][3]);

            //console.log(treatJS[0]);
*/
            //console.dir(leaves);
            //console.log(typeof (json));
            //var html = tableify(json);
            //console.log(html);
            //var strHtml = json.stringify(html);
            var splithtml = json.split(/{/);

            var replace1 = json.replace(/{/g,"<td>");
            var replace2 = replace1.replace(/}/g,"</td>");
            //var replace2 = replace1.replace(/,/g,",<br/>");
            //var splithtml = json.split(/\".*\"{1}/g);
            var res = '';
            for (var i = 0; i < splithtml.length ; i ++){

                if(splithtml[i].indexOf("}")>0){
                    var temp ="<br/>node:{"+splithtml[i].replace("}","");
                    var temp2 = temp.substring(5);
                    var temp3 = temp2.split(",");

                    res+=(temp+"<br/>");
                    for (var j = 0; j < temp3.length ; j ++){
                        //res+=("<br/>    preoperties:"+temp3[j]);
                    }
                }

            }
            //response.write(treatJS);

            //response.end();
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("received data:<br/>");

            var func =
                '<script type="text/javascript">'+
                'function showButton(id){' +
                '   if(document.getElementById(id).style.display=="block"){' +
                '       document.getElementById(id).style.display="none"' +
                '   } else {' +
                '       document.getElementById(id).style.display="block";' +
                '   }'+
                '}'+
                '</script>';


            response.write(func);

            for (var i = 0 ; i<treatJS.length; i ++){

                response.write("<input type = 'button' onclick='showButton(\"toc"+i+"\")' value = data"+i+">");
                response.write("<div id=\"toc"+i+"\" hidden>");
                response.write("<table style=\"width:100%\">");

                for (var j = 0; j < treatJS[i].length; j++){

                    //response.write(treatJS[i][j].datablock+"<br/>");
                    //console.log("treatJS["+i+"]["+j+"]"+treatJS[i][j].datablock);
                    var htmlLine = JSONtoCSV(treatJS[i][j]);
                    //var htmlLine = JSONtoHTML(treatJS[i][j]);
                    response.write(htmlLine);
                }
                response.write("</table>");
                response.write("</div>");
                response.write("<br/>");
            }

            //response.write("<img src='/show' />");
            //response.write("<lable>test</lable>")
            response.end();
        }
    });


}



function showtraverse(response) {
    console.log("Request handler 'show' was called.");
    fs.readFile("/tmp/test.xml", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            var json = parser.toJson(file); //returns a string containing the JSON structure by default
            //console.log(json);
            var leaves = traverse(json).reduce(function (acc, x) {
                if (this.isLeaf) acc.push(x);
                return acc;
            }, []);

            //console.dir(leaves);
            console.log(typeof (leaves));
            var res = JSON.stringify(leaves);
            response.write(json);

            response.end();
        }
    });
}

function buildHtmlTable(selector) {
    var columns = addAllColumnHeaders(myList, selector);

    for (var i = 0 ; i < myList.length ; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];

            if (cellValue == null) { cellValue = ""; }

            row$.append($('<td/>').html(cellValue));
        }
        $(selector).append(row$);
    }
}

function addAllColumnHeaders(myList, selector){
    var columnSet = [];
    var headerTr$ = $('<tr/>');
    for (var i = 0 ; i < myList.length ; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1){
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }

    $(selector).append(headerTr$);

    return columnSet;
}

function treatJson( json ){

    console.log("transform from JOSN to HTML:start");
    //var temp = json.indexOf("{");

    var str = json;
    var indices = [];
    for(var i=0; i<str.length;i++) {
        if (str[i] === "{") indices.push([i,"{"]);
        if (str[i] === "}") indices.push([i,"}"]);
        if (str[i] === "[") indices.push([i,"["]);
        if (str[i] === "]") indices.push([i,"]"]);
    }


    //},"
    //:{    -> : {<br/>
    var temp1 = json.replace(/:{/g,": {<br/>");
    //","    -> ",<br/>"
    var temp2 = temp1.replace(/\",\"/g,"\",<br/>\"");
    //},"  -> "<br/>},<br/>"
    var temp3 = temp2.replace(/},\"/g,"},<br/>\"");
    //"}    -> "<br/>}
    var temp4 = temp3.replace(/\"}/g,"\"<br/>}");
    //":[{" -> ":[<br/>{<br/>"
    var temp5 = temp4.replace(/\:\[{/g,":[<br/>{<br/>");
    //]     -> "]<br/>
    var temp6 = temp5.replace(/]/g,"]<br/>");
    //}}     -> "}<br/>}
    var temp7 = temp6.replace(/}\}/g,"}<br/>}");
    //},{    -> },<br/>{<br/>
    var temp8 = temp7.replace(/},{/g,"},<br/>{<br/>");
    //}]     -> }<br/>]
    var temp9 = temp8.replace(/}]/g,"}<br/>]");
    //}}     -> "}<br/>}
    var temp10 = temp9.replace(/}\}/g,"}<br/>}");

    var temp11 = temp10.split("<br/>");
    var temp12;
    var temp13=[];
    var indentation = 0;


    var prefix=[];
    var data=[];
    var line=[];

    for(var i=0; i<temp11.length;i++) {

        if(temp11[i].indexOf("{")>-1){

            temp12+=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";

            ele={};
            ele["indentation"] = buildIndentation(indentation)+indentation;
            ele["line"] = temp11[i];
            temp13.push(ele);

            //temp13[i]=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            indentation++;
        }else if(temp11[i].indexOf("}")>-1){

            temp12+=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";

            ele={};
            ele["indentation"] = buildIndentation(indentation)+indentation;
            ele["line"] = temp11[i];
            temp13.push(ele);

            //temp13[i]=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            indentation--;
        }else if(temp11[i].indexOf("[")>-1){

            temp12+=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";

            ele={};
            ele["indentation"] = buildIndentation(indentation)+indentation;
            ele["line"] = temp11[i];
            temp13.push(ele);

            //temp13[i]=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            indentation++;
        }else if(temp11[i].indexOf("]")>-1){

            temp12+=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";

            ele={};
            ele["indentation"] = buildIndentation(indentation)+indentation;
            ele["line"] = temp11[i];
            temp13.push(ele);

            //temp13[i]=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            indentation--;
        }else{
            temp12+=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";

            ele={};
            ele["indentation"] = buildIndentation(indentation)+indentation;
            ele["line"] = temp11[i];
            temp13.push(ele);

            //temp13[i]=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
        }
    }

    var datas = [];
    var dataflag = false;
    for(var i=0; i<temp13.length;i++) {

        if(temp13[i].line.indexOf("[")>-1){
            if(dataflag == false){
                data.push(temp13[i]);
                //console.log("################################a new block#################################################################");
                //console.log("first line#########"+ temp13[i]);
            } else{
                //console.log("################################delete a block#################################################################");
                //console.log("because of" + temp13[i]);
                for (var idx in data){
                    prefix.push(data[idx]);
                    //console.log("data to prefix#########");
                }
                data.length = 0;
                data.push(temp13[i]);
                //console.log("first line after delete#########"+ temp13[i]);
            }

            dataflag = true;
        } else if ((temp13[i].line.indexOf("]")>-1) && (dataflag == true)){
            data.push(temp13[i]);
            dataflag = false;

            //remove duplicate
            //console.log("-------------prefix-------------");



            if(datas.length == 12){
                console.log("this is 12 start")

            }

            var cleanedPrefix = cleanPrefix(prefix);


            if(datas.length == 12){
                console.log("this is 12 end")

            }

            //console.log("-------------cleanedPrefix-------------");

            //if this prefix is already exist ,return index
            //var index = checkPrefix(datas, cleanedPrefix);


            var index = checkTitle(datas, cleanedPrefix,data);


            //prefix is same ,
            if(index>=0){
                //check data title , return data title length
                //var dataLength = checkData(datas[index],cleanedPrefix, data);
                //prefix exist, and data title is same , add to exist
                var dataBlock = addDataToExist(cleanedPrefix, datas[index], data);

                var ele = {};
                ele["prefix"] =dataBlock[0];
                ele["datablock"]=dataBlock;

                console.log("update data " + index);
                datas[index] = ele;

                /*
                //data title is same
                if (dataLength>0) {
                    //prefix exist, and data title is same , add to exist
                    var dataBlock = addDataToExist(cleanedPrefix, datas[index], data);

                    var ele = {};
                    ele["prefix"] =dataBlock[0];
                    ele["datablock"]=dataBlock;

                    console.log("update data " + index);
                    datas[index] = ele;

                }else{
                    //prefix exist, but data title is different, make new block
                    var dataBlock = treatData(cleanedPrefix, data);
                    var ele = {};
                    ele["prefix"] =dataBlock[0];
                    ele["datablock"]=dataBlock;

                    console.log("add a new data to datas with number"+ datas.length);
                    datas.push(ele);
                }
                */
            }
            //prefix is different
            else {
                //prefix is not exist, make new block
                var dataBlock = treatData(cleanedPrefix, data);
                var ele = {};
                ele["prefix"] =dataBlock[0];
                ele["datablock"]=dataBlock;

                console.log("add a new data to datas with number"+ datas.length);
                datas.push(ele);
            }

            /*
            if(index<0){
                //prefix is not exist, make new block
                var dataBlock = treatData(cleanedPrefix, data);
            } else {

                if (dataLength>0) {
                    //prefix is exist, and data title is the same , add to exist
                    var dataBlock = addDataToExist(dataLength, datas[index], data);
                }else{
                    //prefix is exist, but data title is different, make new block
                    var dataBlock = treatData(cleanedPrefix, data);
                }
            }
            */

            data.length = 0;
            //console.log("because this " + temp13[i]);
            //console.log("################################output a block#################################################################");
        } else if ( dataflag == true ){
            data.push(temp13[i]);
            //console.log("add a new line#########"+ temp13[i]);
        } else if (dataflag == false){
            prefix.push(temp13[i]);
            //console.log("prefix#########");
        }
    }

    /*
    console.log("datas length is "+datas.length);
    console.log(datas[0]);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(datas[1]);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(datas[2]);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    //console.log(datas[1]);
    */


    /*console.log(datas[0][0]);
    console.log("length of datas[0] is "+datas[0].length);
    console.log(datas[0][0]);
    console.log(datas[0][1]);
    console.log(datas[0][2]);
    console.log(datas[0][3]);
    */

    var res = [];

    for(var i = 0; i< datas.length ; i++){
        res.push(datas[i].datablock);
    }


    return res;
}

function buildIndentation(index){
    //var strindent = '----';
    var strindent = '';
    var temp = index;
    var res="";
    while(temp >0){
        res+=strindent;
        temp--;
    }
    //console.log("transform from JOSN to HTML:end");
    return res;
}


function addNewPage(response,request, postdata){
    console.log("postData is " +postdata);
    console.log(typeof(postdata));

    console.log("addNewPage");
    response.write(postdata);
    response.end;
}

function treatData(prefix,data ){

    console.log("build datablock:start");


    var title = [];
    var rows = [];
    var rowPrefix = [];
    var dataPrefix = [];
    var ele={};
    for(var i = 0 ; i < prefix.length; i++){
        var splitPoint = prefix[i].line.indexOf(":");

        if (splitPoint>-1){

            var att = prefix[i].line.substring(0,splitPoint);
            var val = prefix[i].line.substring(splitPoint);


            if(val !=  ": {" && val !=":["){
                ele={};
                ele["indentation"] ="";
                ele["line"]=att;

                title.push(ele);

                ele={};
                ele["indentation"] = prefix[i].indentation;
                ele["line"]=val.substring(1);

                rowPrefix.push(ele);
                //rowPrefix.push(val.substring(0,val.length-5).substring(1));
            }
        }
    }


    var count = 0;
    for(var i = 0 ; i < data.length; i++){
        var splitPoint = data[i].line.indexOf(":");
        var row =rowPrefix.slice(0);

        if(data[i].line.indexOf("{")>-1){
            count++;
            dataPrefix.length = 0;
        }

        if (splitPoint>-1){
            if(count==1){
                var att = data[i].line.substring(0,splitPoint);
                ele={};
                ele["indentation"] ="";
                ele["line"]=att;
                title.push(ele);
            }
            var val = data[i].line.substring(splitPoint);
            var temp = val.substring(1);
            if(temp.substring(val.length-1)==","){
                temp = temp.substring(0,val.length-1);
            }

            ele={};
            ele["indentation"] = data[i].indentation;
            ele["line"]=temp;



            dataPrefix.push(ele);
            /*
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$");
            console.log(data[i].substring(0,splitPoint));
            console.log(dataPrefix);
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$");
            */
        }



        if(data[i].line.indexOf("}")>-1){
            var temp = rowPrefix.slice(0);
            for (idx in dataPrefix){
                temp.push(dataPrefix[idx]);
            }

            //var res = cleanPrefix(temp);

            var row = temp;

            rows.push(row);
        }
    }


    //title.push("<br/>");
    //console.log(title);
    rows.unshift(title);

    /*
    for (idx in rows){
        console.log("MMMMMMMMMMMMMMMMMMM");
        console.log("row is " + rows[idx]);
        console.log("MMMMMMMMMMMMMMMMMMM");

    }
    */
    //console.log("build datablock:end");
    return rows;

}
function JSONtoCSV(inputCSV){
    var res = "";

    res+="";
    for(idx in inputCSV){

        res+=inputCSV[idx].line;
        if(res.substring(res.length-1)==","){

        }else {
            res+=",";
        }

    }

    res = res.substring(0,res.length-1);
    res+="<br/>";

    return res;
}


function JSONtoHTML(inputCSV){

    //console.log(inputCSV);
    var res = "";

    res+="<tr>";
    for(idx in inputCSV){
        res+="<td>";
        res+=inputCSV[idx].line;
        res+="</td>";
    }
    res+="</tr>";

    return res;

}

function cleanPrefix(prefix){
    //console.log("--------------------------------------");
    //console.log(prefix);
    for(aa in prefix){
        //console.log("before clean"+prefix[aa].indentation+prefix[aa].line);
    }
    console.log("-------------------------------------------------------------")



    var startMark = 0;
    var endMark = 0;
    var startLine = 0;
    var endLine = 0;
    var startData = "";

    var part1 = [];
    var part2 = [];

    var res = [];

    for(var i = prefix.length-1; i >3; i--){

        //console.log(datablock[i].indentation+datablock[i].line);
        //console.log(datablock[i].indentation+datablock[i].line);
        //console.log("prefix[i] is "+prefix[i].indentation);
        console.log("prefix["+i+"] is "+prefix[i].indentation+prefix[i].line);
        console.log("prefix[i-1] is "+prefix[i-1].indentation);
        console.log("prefix[i-2] is "+prefix[i-2].indentation);


        if((prefix[i].indentation-prefix[i-1].indentation)<=-1
            && (prefix[i-1].indentation-prefix[i-2].indentation)<=-1){

            console.log("here is a start mark with " + startMark);

            endLine = i;
            startMark = prefix[i].indentation;

            break;
        }
    }


    for(var i = endLine; i >3; i--){

        //console.log("this is datablock"+i+" : "+datablock[i].indentation+datablock[i].line);
        //console.log(datablock[i].indentation+datablock[i].line);

        if(prefix[i].indentation==startMark){

            console.log("here is a end mark with " + startMark);


            endMark++;
            if(endMark==2){
                startLine=i;
                break;
            }
        }


    }

    //console.log(startLine);
    //console.log(prefix[startLine-1]);
    //console.log(prefix[startLine]);
    //console.log(endLine);

    if(prefix.indexOf(prefix[startLine])>0){
        //startLine=prefix.indexOf(prefix[startLine]);
    }

    console.log("startLine = "+startLine +"; endLine = "+ endLine);
    if(startLine<endLine) {
        //console.log(endLine);
        part1 = prefix.slice(0, startLine);
        part2 = prefix.slice(endLine);

        //var allPart = part1;
        for (idx in part2){
            part1.push(part2[idx]);
            //console.log(temp);
            //cleanPrefix(temp);
        }

        console.log("start another loop with length = " + part1.length);
        res = cleanPrefix(part1);
    }else {
        console.log("final loop with length = " + prefix.length);
        res = prefix;
    }


    //console.log(res);
    //console.log("res with length = " + res.length);
    for(aa in res){
        //console.log("after clean"+res[aa].indentation+res[aa].line);
    }
    return res;
}


function checkPrefix(datas, prefix){
    console.log("checkPrefix start");
    //console.log("prefix is " + prefix[1]);
    //console.log("datas[idx] is " + datas[0][1]);
    for(idx in datas){
        //console.log("prefix is " + prefix.toString());
        //console.log("datas[idx] is " + datas[idx].prefix.toString());
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log("prefix is " + prefix.length);
        for(aa in prefix){
            //console.log(prefix[aa].indentation+prefix[aa].line);
        }
        console.log("datas[idx].prefi is " + datas[idx].prefix.length);
        console.log("----------------------------------------------------------------------------------------------------");
        for(bb in datas[idx].prefix){
            //console.log(datas[idx].prefix[bb].indentation+datas[idx].prefix[bb].line);
        }

        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

        if(datas[idx].prefix.length != prefix.length){
            //console.log("checkPrefix end: index is -1");
            return -1;
        }
        for(var i = 0 ; i < datas[idx].length; i++){
            if(datas[idx].prefix[i]!=prefix[i]){
                //console.log("checkPrefix end: index is -1");
                return -1;
            }
        }
        console.log("checkPrefix end: index is "+ idx);
        return idx;
        /*
        if(datas[idx]==prefix){
            console.log("index is " + idx);
            return idx;
        }
        */
    }
    //console.log("checkPrefix end: index is -1");
    return -1;
}

function checkTitle(datas,prefix, comparedData){
    console.log("checkTitle start");

    var title = [];

    var ele={};
    for(var i = 0 ; i < prefix.length; i++){
        var splitPoint = prefix[i].line.indexOf(":");

        if (splitPoint>-1){

            var att = prefix[i].line.substring(0,splitPoint);
            var val = prefix[i].line.substring(splitPoint);


            if(val !=  ": {" && val !=":["){
                ele={};
                ele["indentation"] ="";
                ele["line"]=att;

                title.push(ele);
            }
        }
    }

    var res;

    //console.log("datas length " +datas.length);

    for(var i = 0; i < datas.length; i++){
        //log for compare title console.log("it is "+ i + "th data");
        res = true;
        if(datas[i].prefix.length <= title.length){
            res = false;
            continue;
        }

        for(idx in title){
            //console.log("datas prefix is  " +datas[i].prefix[idx]);
            //log for compare title console.log(title[idx].line+" and "+datas[i].prefix[idx].line + " are same");
            if(title[idx].line != datas[i].prefix[idx].line){
                //console.log(title[idx].line+" and "+datas[i].prefix[idx].line + " are different");
                res = false;
                break;
            }
        }

        if(res == true){
            //log for compare title console.log("checkTitle : data "+ i +" has same title");

            if(checkData(datas[i],title.length, comparedData)>0){
                //log for compare title console.log("checkTitle : data "+ i +" has same data type");
                return i;
            }
            //return i;
        }
    }

    //console.log("checkTitle end: return -1");
    return -1;
}

function addDataToExist(prefix, originalData, additionalData){
    /*
     var ele = {};
     ele["prefix"] =cleanedPrefix;
     ele["datablock"]=dataBlock;

     datas[index] = ele;
    * */

    //console.log("add additional data to exist index "+ dataLength);
    var rowPrefix = [];
    var dataPrefix = [];

    for(var i = 0 ; i < prefix.length; i++){
        var splitPoint = prefix[i].line.indexOf(":");

        if (splitPoint>-1){

            var att = prefix[i].line.substring(0,splitPoint);
            var val = prefix[i].line.substring(splitPoint);


            if(val !=  ": {" && val !=":["){

                ele={};
                ele["indentation"] = prefix[i].indentation;
                ele["line"]=val.substring(1);

                rowPrefix.push(ele);
                //rowPrefix.push(val.substring(0,val.length-5).substring(1));
            }
        }
    }

    var rows = originalData.datablock.slice(0);

    //console.log("originalData.datablock.length = "+originalData.datablock.length);
    //var lastEle = originalData.datablock[originalData.datablock.length -1];

    /*
    for(idx in lastEle){
        //console.log("idx is"+idx+" : "+lastEle[idx]);
        if (idx == (originalData.datablock.length-dataLength-1)) break;
        rowPrefix.push(lastEle[idx]);
    }
    */

    //rowPrefix=lastEle.slice(0,originalData.datablock[0].length-dataLength-1);
    //console.log("lastEle"+lastEle);
    //console.log("rowPrefix"+rowPrefix);
    for(var i = 0 ; i < additionalData.length; i++) {
        var splitPoint = additionalData[i].line.indexOf(":");
        //var row =rowPrefix.slice(0);

        if (additionalData[i].line.indexOf("{") > -1) {
            dataPrefix.length = 0;
        }

        if (splitPoint > -1) {

            var val = additionalData[i].line.substring(splitPoint);
            var temp = val.substring(1);
            if (temp.substring(val.length - 1) == ",") {
                temp = temp.substring(0, val.length - 1);
            }

            ele = {};
            ele["indentation"] = additionalData[i].indentation;
            ele["line"] = temp;

            dataPrefix.push(ele);
        }

        if(additionalData[i].line.indexOf("}")>-1){
            var temp = rowPrefix.slice(0);
            for (idx in dataPrefix){
                temp.push(dataPrefix[idx]);
            }

            //var res = cleanPrefix(temp);

            var row = temp;

            rows.push(row);
        }
    }
    console.log("add additional data end");
    return rows;
}


function checkData(originalData,prefixLength, comparedData){
    //console.log("checkData start");


    var dataPrefix = [];
    var dataTitle = [];
    var count = 0;
    for(var i = 0 ; i < comparedData.length; i++) {
        var splitPoint = comparedData[i].line.indexOf(":");

        if (comparedData[i].line.indexOf("{") > -1) {
            count++;
            dataPrefix.length = 0;
        }

        if (splitPoint > -1) {
            if (count == 1) {
                var att = comparedData[i].line.substring(0, splitPoint);
                ele = {};
                ele["indentation"] = "";
                ele["line"] = att;
                dataTitle.push(ele);
            }
        }
    }
    //console.log("original data is "+originalData);
    //console.log("original data length is "+originalData.datablock[0]);

    var originalTitle = originalData.datablock[0];

    //log for compare title console.log(prefixLength +" + "+ dataTitle.length +" : " + originalTitle.length)
    if((prefixLength + dataTitle.length)!=originalTitle.length){
        //console.log("checkData end: title length different, return -1");
        return -1;
    }


    //console.log("original title is "+originalTitle);

    for (var i = 0; i < dataTitle.length ; i++){
        if(dataTitle[dataTitle.length-i-1].line!=originalTitle[originalTitle.length-i-1].line){
            console.log("checkData end: title context different, return -1");
            return -1;
        }
    }

    console.log("checkData end: find same title at index " + dataTitle.length);
    return dataTitle.length;
}

function writeLog(msg){

    var fs = require('fs');
    var util = require('util');
    var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
    var log_stdout = process.stdout;

    console.log = function(d) { //
        log_file.write(util.format(d) + '\n');
        log_stdout.write(util.format(d) + '\n');
    };


}

function realfunction(response,request,postData) {
    console.log("reading file " + postData );
    var test ;
    var treatJS =[];
    var req = require('request');

    var xml = "";

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received data:<br/>");

    var func =
        '<script type="text/javascript">'+
        'function showButton(id){' +
        '   if(document.getElementById(id).style.display=="block"){' +
        '       document.getElementById(id).style.display="none"' +
        '   } else {' +
        '       document.getElementById(id).style.display="block";' +
        '   }'+
        '}'+
        '</script>';


    response.write(func);

    //req(postData).pipe(fs.createWriteStream('/home/wk/result.html'))

    req.get(postData, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            //test = body.toString();

            var json = parser.toJson(body);

            treatJS = treatJson(json);

            var result = "";
            result+=func;
            for (var i = 0 ; i<treatJS.length; i ++){

                result+=("<input type = 'button' onclick='showButton(\"toc"+i+"\")' value = data"+i+">");
                result+=("<div id=\"toc"+i+"\" hidden>");
                result+=("<table style=\"width:100%\">");

                for (var j = 0; j < treatJS[i].length; j++){

                    var htmlLine = JSONtoCSV(treatJS[i][j]);

                    result+=(htmlLine);
                }
                result+=("</table>");
                result+=("</div>");
                result+=("<br/>");
            }

            console.log(result);

            var fs = require('fs');
            fs.writeFile("/tmp/result.html", result, function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });

        }

    });


    console.log("reading file finished");



    //response.write("<a href = '/tmp/test'> test ");

    console.log("treatJS.length"+treatJS.length);
    for (var i = 0 ; i<treatJS.length; i ++){

        response.write("<input type = 'button' onclick='showButton(\"toc"+i+"\")' value = data"+i+">");
        response.write("<div id=\"toc"+i+"\" hidden>");
        response.write("<table style=\"width:100%\">");

        for (var j = 0; j < treatJS[i].length; j++){

            var htmlLine = JSONtoCSV(treatJS[i][j]);

            response.write(htmlLine);
        }
        response.write("</table>");
        response.write("</div>");
        response.write("<br/>");
    }

    response.end();


    console.log("response.end()");
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.xmlload = xmlload;
//exports.showxml2json = showxml2json;
exports.showtraverse = showtraverse;
exports.addNewPage = addNewPage;
exports.realfunction = realfunction;
