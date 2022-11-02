var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
let data = fs.readFileSync("usernames.json", "utf8");
data = JSON.parse(data);
app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/userid", (req, res) => {
	if (req.body.username in data) {
		if (req.body.password == data[req.body.username]) {
			res.status(200).json({ data: "success" });
			res.end();
		} else {
			res.status(404).json({ error: "invalid password" });
		}
	} else {
		res.status(404).json({ error: "not found" });
		res.end();
	}
});
app.post("/inbox", (req, res) => {
	var inboxMail = fs.readFileSync(`./users/${req.body.username}.json`, "utf8");
	inboxMail = JSON.parse(inboxMail);
	res.send(inboxMail);
	res.end();
});

app.post("/sent", (req, res) => {
	var sentMail = fs.readFileSync(`./users/${req.body.username}.json`, "utf8");
	sentMail = JSON.parse(sentMail);
	res.send(sentMail);
	res.end();
});

app.post("/trash", (req, res) => {
	var trashMail = fs.readFileSync(`./users/${req.body.username}.json`, "utf8");
	trashMail = JSON.parse(trashMail);
	res.send(trashMail);
	res.end();
});

app.post("/signup", (req, res) => {
	if (!(req.body.username in data)) {
		data[req.body.username] = req.body.password;
		var mailData = JSON.stringify(data);
		fs.writeFile("usernames.json", mailData, () => {});
		var inboxAndSentbox = { inbox: [], sent: [], trash: [] };
		inboxAndSentbox = JSON.stringify(inboxAndSentbox);
		fs.writeFile(
			`./users/${req.body.username}.json`,
			inboxAndSentbox,
			() => {}
		);
		res.status(200).json({ data: "success" });
		res.end();
	} else {
		res.status(404).json({ error: "already exists" });
		res.end();
	}
});

app.post("/delete", (req, res) => {
	var userMessage = fs.readFileSync(
		`./users/${req.body.username}.json`,
		"utf8"
	);
	if (req.body.sender == "from") {
		var inbox = JSON.parse(userMessage);
		var inboxIndex = inbox["inbox"].length - 1 - req.body.index;
		var inboxDeletedElement = inbox["inbox"].splice(inboxIndex, 1);
		inbox["trash"].push(inboxDeletedElement[0]);
		inbox = JSON.stringify(inbox);
		fs.writeFile(`./users/${req.body.username}.json`, inbox, () => {});
	} else if (req.body.sender == "to") {
		var sent = JSON.parse(userMessage);
		var sentIndex = sent["sent"].length - 1 - req.body.index;
		var sentboxDeletedElement = sent["sent"].splice(sentIndex, 1);
		sent["trash"].push(sentboxDeletedElement[0]);
		sent = JSON.stringify(sent);
		fs.writeFile(`./users/${req.body.username}.json`, sent, () => {});
	} else {
		var trash = JSON.parse(userMessage);
		var trashIndex = trash["trash"].length - 1 - req.body.index;
		trash["trash"].splice(trashIndex, 1);
		trash = JSON.stringify(trash);
		fs.writeFile(`./users/${req.body.username}.json`, trash, () => {});
	}
	res.status(200).json({ data: "success" });
	res.end();
});

app.post("/sendmail", (req, res) => {
	if (req.body.to in data) {
		sendMailContent(req.body);
		inboxMailContent(req.body);
		res.status(200).json({ data: "success" });
		res.end();
	} else {
		res.status(404).json({ error: "already exists" });
	}
});
function sendMailContent(sentBody) {
	var sentBox = fs.readFileSync(`./users/${sentBody.username}.json`, "utf8");
	var sentContent = {};
	sentContent["to"] = sentBody.to;
	sentContent["sub"] = sentBody.subject;
	sentContent["content"] = sentBody.message;
	sentContent["date"] = sentBody.date;
	sentContent["time"] = sentBody.time;
	sentBox = JSON.parse(sentBox);
	sentBox["sent"].push(sentContent);
	sentBox = JSON.stringify(sentBox);
	fs.writeFile(`./users/${sentBody.username}.json`, sentBox, () => {});
}
function inboxMailContent(inboxBody) {
	var inboxMessage = fs.readFileSync(`./users/${inboxBody.to}.json`, "utf8");
	var SubAndMessage = {};
	SubAndMessage["from"] = inboxBody.username;
	SubAndMessage["sub"] = inboxBody.subject;
	SubAndMessage["content"] = inboxBody.message;
	SubAndMessage["date"] = inboxBody.date;
	SubAndMessage["time"] = inboxBody.time;
	inboxMessage = JSON.parse(inboxMessage);
	inboxMessage["inbox"].push(SubAndMessage);
	inboxMessage = JSON.stringify(inboxMessage);
	fs.writeFile(`./users/${inboxBody.to}.json`, inboxMessage, () => {});
}
app.listen(8000);
