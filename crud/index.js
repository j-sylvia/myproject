const http=require('http');
const mysql=require('mysql2');
const fs=require('fs');
const path=require('path');
const url=require('url');
const hbs=require('hbs');

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'admin',
    database:'node_db_1'
});

db.connect((err)=>{
    if(err){
        console.error('Error connecting to MySQL:',err)
    }
    else{
        console.log('Connected to mySql database ');
        
    }
});


http.createServer((req,res)=>{
    const reqUrl=url.parse(req.url,true);
    if(reqUrl.pathname === '/'){
        const filePath = path.join(__dirname,'home.html');

        fs.readFile(filePath, 'utf8',(err,data)=>{
            if(err){
                res.writeHead(500).end('Error loading home page');   
            }
            else{
                console.log("Success")
                res.writeHead(200,{'Content-Type':'text/html'});
                res.end(data);
            }
        })
    }
    else if(reqUrl.pathname === '/form'){
        const filePath = path.join(__dirname,'form.html');
        fs.readFile(filePath,'utf8',(err,data)=>{
            if(err){
                res.writeHead(500).end('Error loading form');   
            }
            else{
                console.log("Success");
                res.writeHead(200,{'Content-Type':'text/html'});
                res.end(data);
            }
        })
    }
    else if(req.method === 'POST' && reqUrl.pathname === '/submit-form'){
        let body='';
        req.on('data',chunk=>{
            body=body+chunk.toString();
            // console.log(body)
        });
        req.on('end',()=>{
            const formData=new URLSearchParams(body);
            const name=formData.get('name');
            const email=formData.get('email');
            const message=formData.get('message');

            const createTableQuery="CREATE TABLE IF NOT EXISTS formdata (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), message TEXT)";

            db.query(createTableQuery,(error,results)=>{
                if(error){
                    console.log('Error creating table:',error)
                    res.writeHead(500).end('Error create table');   
                }
                else{
                    console.log("Table created successfully");
                    
                }
            })
            const insertQuery=`INSERT INTO formdata (name,email,message) VALUES (?,?,?)`;
            db.query(insertQuery,[name,email,message],(error,results)=>{
                if(error){
                    console.log('Error inserting data:',error)
                    res.writeHead(500).end('Error inserting data');   
                }
                else{
                    console.log("Data inserted successfully");
                    res.writeHead(302,{'Location':'/'}) //redirect to home after submission
                    res.end();
                }
            })
        })

    }
    else if(reqUrl.pathname === '/display-data'){
       
            db.query('SELECT * FROM formdata',(error,results)=>{
                if(error){
                    console.log('Error fetching data:',error)
                    res.writeHead(500).end('Error fetching data');   
                }
                else{
                    // console.log(results)
                    const filePath=path.join(__dirname,'template.html');
                    fs.readFile(filePath,'utf8',(err,templateData)=>{
                        if(err){
                            console.log('Error reading template file:',err)
                            res.writeHead(500).end('Error reading template file');   
                        }
                        else{
                            //using template engines like handlebars
                            const template=hbs.compile(templateData);
                            const renderedPage=template({data:results});
                            // console.log(renderedPage)
                            res.writeHead(200,{'Content-Type':'text/html'});
                            res.end(renderedPage);
                        }
                    })
                    
                }
            })

    }
    else if(reqUrl.pathname === '/data-updation'){
       
        db.query('SELECT name FROM formdata',(error,results)=>{
            if(error){
                console.error('Error fetching names:',error)
                res.writeHead(500).end('Error fetching names');   
            }
            else{
                const names=results.map(row=>row.name);
                const filePath=path.join(__dirname,'update.html');
                fs.readFile(filePath,'utf8',(err,data)=>{
                    if(err){
                        res.writeHead(500).end('Error loading form');   
                    }
                    else{
                        //compile the html form using handlebars
                        const template=hbs.compile(data);
                        const renderedForm=template({names:names});
                        res.writeHead(200,{'Content-Type':'text/html'});
                        res.end(renderedForm);
                    }
                })               
            }
        })

}
else if(req.method === 'POST' && reqUrl.pathname === '/update-data'){
    let body='';
    req.on('data',chunk=>{
        body=body+chunk.toString();
    });
    req.on('end',()=>{
        const formData=new URLSearchParams(body);
        const id=formData.get('id');
        const name=formData.get('name');
        const email=formData.get('email');
        const message=formData.get('message');

        const updateQuery="UPDATE formdata SET email=?, message=? WHERE name=?";

        db.query(updateQuery,[email,message,name],(error,results)=>{
            if(error){
                console.log('Error updating data:',error)
                res.writeHead(500).end('Error updating data');   
            }
            else{
                console.log("Data updated successfully");
                res.writeHead(302,{'Location':'/'});
                res.end();
            }
        })
    })

}
else if(reqUrl.pathname === '/data-delete'){
       
    db.query('SELECT name FROM formdata',(error,results)=>{
        if(error){
            console.error('Error fetching names:',error)
            res.writeHead(500).end('Error fetching names');   
        }
        else{
            const names=results.map(row=>row.name);
            const filePath=path.join(__dirname,'delete.html');
            fs.readFile(filePath,'utf8',(err,data)=>{
                if(err){
                    res.writeHead(500).end('Error loading form');   
                }
                else{
                    //compile the html form using handlebars
                    const template=hbs.compile(data);
                    const renderedForm=template({names:names});
                    res.writeHead(200,{'Content-Type':'text/html'});
                    res.end(renderedForm);
                }
            })               
        }
    })

}
    else if(req.method === 'POST' && reqUrl.pathname === '/delete-data'){
        let body='';
        req.on('data',chunk=>{
            body+=chunk.toString();
        });
        req.on('end',()=>{
            const formData=new URLSearchParams(body);
            const name=formData.get('name');

            const deleteQuery="DELETE FROM formdata WHERE name=?";

            db.query(deleteQuery,[name],(error,results)=>{
                if(error){
                    console.log('Error deleting data:',error)
                    res.writeHead(500).end('Error deleting data');   
                }
                else{
                    console.log("Data deleted successfully");
                    res.writeHead(302,{'Location':'/'}) //redirect to home after submission
                    res.end();
                }
            })
        })

    }
    else if(reqUrl.pathname === '/' || reqUrl.pathname === '/home'){
        const homeFilePath = path.join(__dirname,'home.html');
        fs.readFile(homeFilePath,'utf8',(err,data)=>{
            if(err){
                res.writeHead(500).end('Error loading home page');   
            }
            else{
                res.writeHead(200,{'Content-Type':'text/html'});
                res.end(data);
            }
        })
    }
    else{
        res.writeHead(404).end('Not Found');
    }
}).listen(8000,()=>{
    console.log('Server is running on http://localhost:8000');
});
