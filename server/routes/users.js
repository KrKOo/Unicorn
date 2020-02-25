import express from 'express'
const router = express.Router()
import jwt from 'jsonwebtoken';

import cookie from 'cookie';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
	destination: "../client/public/profileImages",
	filename: function (req, file, cb) {
		cb(null, "PROFILE-" + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 },
}).single("myImage");

import dba from '../modules/Database.js';


const database = new dba();


router.get('/get/:id', function (req, res, next) {
	const userID = req.params.id;

	database.query(`SELECT username, description, profileImg FROM user WHERE id=?`, [userID])
		.then(result => {
			res.send(result[0]);
		})
		.catch(err => {
			console.log(err);
		});
});

router.post('/updateDescription', function (req, res, next) {
	const description = req.body.description;

	const cookies = cookie.parse(req.headers.cookie);
	try {
		const decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, { algorithm: ['HS256'] });
		var userID = decodedToken.userID;

		database.query(`UPDATE user SET description=? WHERE id=?`, [description, userID])
			.then(result => {
				res.send("Description updated successfully");
			})
			.catch(err => {
				console.log(err);
			});

	}
	catch (err) {
		console.log(err);
	}
});

router.post('/updateProfileImg', function (req, res, next) {
	let filename;
	try {
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				return
			} else if (err) {
				return
			}

			if (!req.file) {
				return;
			}
			console.log(req.file);
			filename = req.file.filename;

			const cookies = cookie.parse(req.headers.cookie);
			const decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, { algorithm: ['HS256'] });
			var userID = decodedToken.userID;

			database.query(`UPDATE user SET profileImg=? WHERE id=?`, [filename, userID])
				.then(result => {

				})
				.catch(err => {
					console.log(err);
				});

			if (!err) {
				return res.send({ filename: filename }).end();
			}

		})
	} catch (err) {
		console.log(err);
	}
});

router.post('/manageFriend', function (req, res, next) {
	const friendID = req.body.friendID;
	try {
		const cookies = cookie.parse(req.headers.cookie);
		const decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, { algorithm: ['HS256'] });
		var userID = decodedToken.userID;

		const minID = Math.min(userID, friendID);
		const maxID = Math.max(userID, friendID);


		console.log(userID + " " + friendID);
		console.log(minID + " " + maxID);

		database.query(`SELECT * from friendship WHERE user1_id = ? AND user2_id = ?`, [minID, maxID])
			.then(result => {
				if (result[0] == undefined) {
					return database.query(`INSERT INTO friendship(user1_id, user2_id, status, action_user_id) VALUES (?,?,0,?)`, [minID, maxID, userID])
				}
				else {
					throw "This user is already your friend";
				}
			})
			.then(() => {
				res.send(200).end();
			})

			.catch(err => {
				console.log(err);
			})
	} catch (err) {
		console.log(err);
	}

});

router.get('/getFriends/', function (req, res, next) {
	try {
		const cookies = cookie.parse(req.headers.cookie);
		const decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, { algorithm: ['HS256'] });
		var userID = decodedToken.userID;

	database.query(`SELECT user.id, user.username, user.profileImg, friendship.status FROM user  
					LEFT JOIN friendship ON friendship.user1_id = LEAST(user.id, ?) AND friendship.user2_id = GREATEST(user.id, ?)
					WHERE id IN
					(SELECT user1_id FROM friendship WHERE user2_id = ?
					UNION
					SELECT user2_id FROM friendship WHERE user1_id = ?)`, [userID, userID, userID, userID])
		.then(result => {
			res.send(result);
		})
		.catch(err => {
			console.log(err);
		});
	}catch(err)
	{
		console.log(err);
	}
});



export default router