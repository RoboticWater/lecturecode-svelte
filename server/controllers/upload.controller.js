import WebSocket from 'ws'
// @route POST /upload
// @desc  Uploads file to DB
export function upload(req, res) {
	console.log("[uplaod] creating db entry", req.file)
	req.app.io.emit('fileupdate', req.file.filename);
	res.json({ file: req.file });
}