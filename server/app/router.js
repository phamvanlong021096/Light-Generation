const express    = require('express');
const user       = require('./model/user');
const passport   = require('passport');
const task       = require('./model/task');
const statistics = require('./model/statistics');

const aggregateController = require('./controller/aggregateController');

module.exports = (app, passport) => {
    app.get('/', (req, res) => {
        res.send('Server vẫn đang chạy nha!!!');
    });

    //nơi code API
    const apiRouter = express.Router();
    apiRouter.get('/user/:username', (req, res) => {
        const username = req.params.username;

        user.findOne({ username: username }).select('_id username info').exec((err, mess) => {
            if (err) throw err;
            if (mess)
                res.status(200).send(mess);
            else
                res.status(404).send('not found');
        });
    });

    //lấy ra 'number' tasks trong db một cách ngẫu nhiên
    apiRouter.get('/questions/:userId/:number', (req, res) => {
        const userId   = req.params.userId;
        const noTasks  = Number(req.params.number);

        task.aggregate([{$sample : {size : noTasks}}]).exec((err, mess) => {
            if (err) throw err;
            if (mess)
                res.status(200).send(mess);
            else
                res.status(404).send(`không thể lấy ra ${number} câu hỏi, nên gửi lại số câu hỏi`);
        });
    });
    //Sửa thông tin username
    apiRouter.put('/user/:username', (req, res) => {
        const username = req.params.username;
        const age      = req.body.age;
        const name     = req.body.name;

        //console.log(username + " " + age + " " + name);
        // user.update({
        //     username: username
        // }, {
        //     info: {
        //         age : req.body.age,
        //         name : req.body.name
        //     }
        // }, function(err, num, rawres){
        //     if (err) throw err;
        //     res.send("Done");
        // });
        user.findOne({
            username: username,
        }, (err, one) => {
            if (err) throw err;
            if (!one) res.send('something err');
            
            //console.log(one);
            // one.info.age = req.body.age;
            // one.info.name = req.body.name;
            one.info = {
                age : req.body.age,
                name : req.body.name
            }
            //console.log(req.body);
            //console.log(one);
            one.save( (err) => {
                if (err) throw err;
                //console.log(one);
                res.send('Thay đổi thông tin thành công');
            }); 
        });        
    });

    apiRouter.post('/log', (req, res) => {
        const taskId   = req.body.taskId;
        const category = req.body.category;
        const attempts = req.body.attempts;
        const username = req.body.username;

        statistics.save({
            username  : username,
            taskId    : taskId,
            category  : category,
            attempts  : attempts,
            createdAt : Date.now(),
        }, (err, successful) => {
            if (err) throw err;
            res.status(200).send('logged!!!');
        });
    });

    apiRouter.get('/log/:username/:typeReq', (req, res) => {
        const typeReq  = req.params.typeReq;
        const username = req.params.username;

        let result = {};
        switch (typeReq) {
            case 'progression':
                statistics.find({
                    username: username,
                }).sort({ category : 1 }).exec((err, mess) => {
                    if (err) throw err;
                    mess.forEach((e) => {
                        if (!result[e.category]) result[e.category] = [];
                        result[e.category].push(e.attempts);
                    });
                    res.send(mess);
                });
                break;
            case 'comparision':
                statistics.find({
                    username: username,
                }).aggregate([
                    { $match: {username: username,} }, //tìm những logs có username tương ứng
                    { $group: {                         //aggregate
                        category: '$category',
                        attempts: {$sum: '$attempts'},
                        counts  : {$sum: 1},
                    } },
                ]).exec((err, mess) => {
                    if (err) throw err;
                    res.send(mess);
                });
                break;
            default:
                res.send('not found');
        }
    });


    //Nơi authenticate
    const authRouter = express.Router();
    authRouter.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.use('/api', apiRouter);
    app.use('/', authRouter);
}
