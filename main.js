const express = require('express');
const user = require('../routes/auth');
// 데이터 값 연결 user.nick과 user.email로 로그인한 사용자 데이터 불러오기 가능

const db = require('../models/index');

const router = express.Router();

var postdata; 
var intro;
var name;
var id;

router.get('/', (req, res) => {
  res.render('main');                               
  });

router.route('/Teammates')

  .get((req,res) =>{
    res.render('Teammates',{user});  
  })

  .post(async(req,res)=> {

    await db.Team.findAll()
    .then((result) =>{
      // console.log(result.id);
      res.send(result);
    })
  
  });

  

router.get('/post', async(req,res) => {
          await db.Post.findAll({raw : true})
          .then((results) =>{
            postdata = results;
            global.postdata = postdata;
          }).catch ((err)=>{
           console.error(err);
          });
          res.render('QnA',{postdata});
});
       
                     


router.get('/introduction',(req,res)=>{
  res.render('introduction',{user})
})

// router.post('/introduction/wdb', async(req,res)=> {
//   var id =req.body.id;
//   await db.Wdb.findOne({raw : true})
//   .then((result) =>{
//     var data = [result.humanaim, result.tc, result.part];
//     // console.log(data[2]);
//     res.send(data);
//   })
router.post('/introduction/wdb', async(req,res)=> {
    name =req.body.name;
    id = req.body.id;
    console.log(name);
    await db.Wdb.findAll({
      raw : true,
      where :{list:name}
    })
    .then((result) =>{
      
    console.log(result);
      res.send(result);
    })
  
  })
router.route('/Introduction/update')
  .get(async(req,res)=>{
    console.log(name);
    await db.Wdb.findAll({
      raw : true,
      where: {list:name}
  }).then((result) => {
    intro = result;
    console.log(result);
    res.end();
  }).catch((error) => {
    console.log(error);
    return next(error);
  });
  
  })
  .post(async(req,res)=>{
  var content = req.body.content;
    console.log([id]);
            await db.Wdb.update({content:content},{where:{id}})
            res.render('introduction',{user,intro});
  })

router.route('/Introduction/updatewrite')
  .get(async(req,res)=>{
    try{
      id =req.query.id;
      intro = await db.Wdb.findOne({where : {id:id}});
      res.render('introup',{user,intro});
    }
    catch (error){
      console.error(error);
      return next(error);
    }
  })

  .post(async(req,res)=>{
    var content = req.body.content;
    await db.Wdb.update({content:content},{where:{id}})
    res.render('introduction',{user});
    })

router.delete('/Introduction/delete', async(req,res)=>{
    id = req.body.id
    await db.Wdb.destroy({where:{id}});
    res.render('introduction',{user});
  })

  router.route('/Introduction/insert')
  
  .get(async(req,res)=> {
    console.log(name);
    res.render('introinsert',{user});
  })
  
  .post(async(req,res)=>{
    var content = req.body.content;
    
    try{
      await db.Wdb.create({
        list:name,
        content,
      });
      res.redirect('/main/Introduction');
    }catch(error){
      console.error(error);
      return next(error);
    }
  })

  module.exports = router;
