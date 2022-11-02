async function getLoginData(inputname, inputpassword) {
	var fetchUserData = await fetch("http://localhost:8000/userid", {
		method: "POST",
		headers: {
			"content-Type": "application/json",
		},
		body: JSON.stringify({
			username: inputname.value,
			password: inputpassword.value,
		}),
	});
	if (fetchUserData.ok) {
		alert("Login success");
		infoPage.style = "display:none";
		mainPage.style = "display:block";
		username = inputname.value;
		password = inputpassword.value;
		inputname.value = "";
		inputpassword.value = "";
	} else {
		alert("login failed");
	}
}

async function getInboxMail(username) {
	try {
		var fetchInboxMail = await fetch("http://localhost:8000/inbox", {
			method: "POST",
			headers: {
				"content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
			}),
		});
		displayMailList(fetchInboxMail);
		sentButton.style = "background-color: rgb(171 227 247); color: rgb(0,0,0)";
		inboxButton.style = "background-color: rgb(5 100 135); color: white";
		trashButton.style = "background-color: rgb(171 227 247); color: rgb(0,0,0)";
		reply.style = "display:block";
		var mail = "Inbox Mails";
		mailHeader.innerHTML = mail;
	} catch (Error) {
		alert(Error.message);
	}
}
async function getSentMail(user) {
	try {
		var fetchSentMail = await fetch("http://localhost:8000/sent", {
			method: "POST",
			headers: {
				"content-Type": "application/json",
			},
			body: JSON.stringify({
				username: user,
			}),
		});
		displaySentMailList(fetchSentMail);
		inboxButton.style = "background-color: rgb(171 227 247); color: rgb(0,0,0)";
		sentButton.style = "background-color: rgb(5 100 135); color: white";
		trashButton.style = "background-color: rgb(171 227 247); color: rgb(0,0,0)";
		reply.style = "display:block";
		var mail = "Sent Mails";
		mailHeader.innerHTML = mail;
	} catch (Error) {
		alert(Error.message);
	}
}
async function getTrashMails(user) {
	try {
		console.log(user);
		var fetchTrashMail = await fetch("http://localhost:8000/trash", {
			method: "POST",
			headers: {
				"content-Type": "application/json",
			},
			body: JSON.stringify({
				username: user,
			}),
		});
		displayTrashMailList(fetchTrashMail);
		inboxButton.style = "background-color: rgb(171 227 247); color: rgb(0,0,0)";
		sentButton.style = "background-color: rgb(171 227 247); color: rgb(0,0,0)";
		trashButton.style = "background-color: rgb(5 100 135); color: white";
		reply.style = "display:none";
		var mail = "Trash Mails";
		mailHeader.innerHTML = mail;
	} catch (Error) {
		alert(Error.message);
	}
}
async function addNewUser(newUser, newPassword) {
	try {
		var newUserId = await fetch("http://localhost:8000/signup", {
			method: "POST",
			headers: {
				"content-Type": "application/json",
			},
			body: JSON.stringify({
				username: newUser.value,
				password: newPassword.value,
			}),
		});
		if (newUserId.ok) {
			infoPage.style = "display:none";
			signupPage.style = "display:none";
			mainPage.style = "display:block";
			username = newUser.value;
		}
	} catch (Error) {
		alert(Error.message);
	}
}

async function sendMail(
	username,
	toAddress,
	SubjectContent,
	messageContent,
	date,
	time
) {
	try {
		var newUserId = await fetch("http://localhost:8000/sendmail", {
			method: "POST",
			headers: {
				"content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				to: toAddress.value,
				subject: SubjectContent.value,
				message: messageContent.value,
				date: date,
				time: time,
			}),
		});
		if (newUserId.ok) {
			mailContainer.style = "display:none";
			alert("Mail sent");
			getInboxMail(username);
		}
	} catch (Error) {
		alert(Error.message);
	}
}

async function putInTrash(i, MessageListName, username) {
	try {
		var messageDelete = await fetch("http://localhost:8000/delete", {
			method: "POST",
			headers: {
				"content-Type": "application/json",
			},
			body: JSON.stringify({
				index: i,
				sender: MessageListName,
				username: username,
			}),
		});
		if (messageDelete.ok) {
			var nextId = 0;
			if (MessageListName == "from") {
				getInboxMail(username);
				displayOneMail(nextId);
			} else if (MessageListName == "to") {
				getSentMail(username);
				displayOneMail(nextId);
			} else {
				getTrashMails(username);
				displayOneMail(nextId);
			}
		}
	} catch (Error) {
		alert(Error.message);
	}
}
