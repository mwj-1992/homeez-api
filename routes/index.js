var express = require('express');
var router = express.Router();
const { Client } = require('pg')
require('dotenv').config();
const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
client.connect();

/* GET all Quotations */
router.get('/', function(req, res, next) {
  let response;
  try{
    const queryTxt = `SELECT *	FROM public."Quotation";`;
    client.query(queryTxt, (err, queryRes) => {
      if (err) {
        console.log(err.stack);
        throw err.stack;
      } else {
        response = queryRes.rows;
        return res.status(200).json(response);
      }
    })
  }catch(e){
    return res.status(500).json(e.message);
  }
});
/**
 * Add a new record into Quotation table
 */
router.post('/',(req, res)=>{
  try{
    const queryTxt = `INSERT INTO public."Quotation" ("Quotation_Info") values($1) RETURNING *;`;
    client.query(queryTxt,[req.body.quotation_info] ,(err, queryRes) => {
      if (err) {
        console.log(err.stack);
        throw err.stack;
      } else {
        return res.status(200).json(queryRes.rows);
      }
    })
  }catch(e){
    return res.status(500).json(e.message);
  }
})


module.exports = router;
