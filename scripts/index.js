var infoPage = document.getElementById("info-page");
var mainPage = document.getElementById("mail-page");
var loginInfo = document.getElementById("login-box");
var signupPage = document.getElementById("signup-page");
var signupSubmit = document.getElementById("signup-submit");
var mailContainer = document.getElementById("mail-compose");
var newUser = document.getElementById("new-user");
var newPassword = document.getElementById("new-password");
var confirmPassword = document.getElementById("confirm-password");
var mismatch = document.getElementById("feedback");
var toAddress = document.getElementById("to-address");
var SubjectContent = document.getElementById("subject-content");
var messageContent = document.getElementById("message-in-mail");
var mailList = document.getElementById("mail-list");
var inboxButton = document.getElementById("inbox");
var sentButton = document.getElementById("sent");
var trashButton = document.getElementById("trash");
var mailHeader = document.getElementById("mail-header");
var reply = document.getElementById("reply-button");
var username, password;
var MessageListName = "from";
var clickedNum;
// function to verify login and display the mails of the user
(function checkLogin() {
	var inputname = document.getElementById("username");
	var inputpassword = document.getElementById("password");
	var login = document.getElementById("login-button");
	login.addEventListener("click", async () => {
		await getLoginData(inputname, inputpassword);
		displayUser(username);
		await getInboxMail(username);
	});
	var composeMail = document.getElementById("compose-mail");
	composeMail.addEventListener("click", composeAMail);

	var deleteButton = document.getElementById("delete-button");
	deleteButton.addEventListener("click", () =>
		putInTrash(clickedNum, MessageListName, username)
	);
	var signup = document.getElementById("signup");
	signup.addEventListener("click", navigateToSignupPage);
	var sendButton = document.getElementById("send-button");
	sendButton.addEventListener("click", sendMailOnClick);
	inboxButton.addEventListener("click", () => getInboxMail(username));
	sentButton.addEventListener("click", () => getSentMail(username));
	trashButton.addEventListener("click", () => getTrashMails(username));
})();
// Function to compose mail
function composeAMail() {
	toAddress.value = "";
	SubjectContent.value = "";
	messageContent.value = "";
	mailContainer.style = "display:block";
}

var refreshButton = document.getElementById("refresh");
refreshButton.addEventListener("click", () => refreshMailList(MessageListName));
// Function to refresh mail in inbox, sent and trash.
function refreshMailList(mailFolder) {
	if (mailFolder == "from") {
		getInboxMail(username);
	} else if (mailFolder == "to") {
		getSentMail(username);
	} else {
		getTrashMails(username);
	}
}

var logout = document.getElementById("logout-button");
logout.addEventListener("click", confirmLogoutUser);
// Function to confirm that the user wants to log out
function confirmLogoutUser() {
	var logoutComfirmation = document.getElementById("logout-container");
	logoutComfirmation.style = "display: block";
}
// Function to logout the user
function confirmlogout(clickedButton) {
	var logoutComfirmation = document.getElementById("logout-container");
	if (clickedButton == "yes") {
		infoPage.style = "display:block";
		loginInfo.style = "display:block";
		mainPage.style = "display:none";
		logoutComfirmation.style = "display: none";
		username = "";
	} else {
		logoutComfirmation.style = "display: none";
	}
}

var counter = 0;
var menuTab = document.getElementById("menu-tab");
// Function to display menu tab
function myFunction(x) {
	if (counter == 0) {
		x.classList.toggle("change");
		menuTab.style = "width:13%";
		document.getElementById("mail-container").style = "width : 60%";
		counter = 1;
	} else {
		x.classList.toggle("change");
		menuTab.style = "width: 0%";
		document.getElementById("mail-container").style = "width : 73%";
		counter = 0;
	}
	console.log(counter);
}
// Function to send a mail when send button is clicked.
function sendMailOnClick() {
	var date = fetchDate();
	var time = fetchTime();
	sendMail(username, toAddress, SubjectContent, messageContent, date, time);
}
// Function to fetch the date on which the mail has been sent
function fetchDate() {
	var date = new Date();
	var day = new Date(date).getDate();
	day = day < 10 ? `0${day}` : day;
	var month = new Date(date).toLocaleString("en-US", { month: "short" });
	var year = new Date(date).getFullYear();
	var exactDate = day + "-" + month + "-" + year;
	return exactDate;
}
// Function to fetch the time on which the mail has been sent.
function fetchTime() {
	var time = new Date();
	var hours = new Date(time).getHours();
	var minute = new Date(time).getMinutes();
	hours = hours < 10 ? `0${hours}` : hours;
	minute = minute < 10 ? `0${minute}` : minute;
	var exactTime = hours + ":" + minute;
	return exactTime;
}
// Function to navigate the user to sign up page.
function navigateToSignupPage() {
	loginInfo.style = "display:none";
	signupPage.style = "display:block";
	newUser.value = "";
	newPassword.value = "";
	confirmPassword.value = "";
}
// Function to add a new user when the submit button is clicked.
signupSubmit.addEventListener("click", async () => {
	if (!(newUser.value.length == 0)) {
		if (validateEmail(newUser)) {
			if (!(newPassword.value.length == 0)) {
				if (newPassword.value == confirmPassword.value) {
					await addNewUser(newUser, newPassword);
					displayUser(username);
				} else {
					mismatch.innerHTML = "Password mismatch";
				}
			} else {
				alert("Enter new password");
			}
		} else {
			alert("Enter username with @domain");
		}
	} else {
		alert("Enter username");
	}
});
// Function to validate email id is with domain
function validateEmail(input) {
	var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (input.value.match(validRegex)) {
		return true;
	} else {
		return false;
	}
}
// Function to display the user name on top
function displayUser(username) {
	var usernameDisplay = document.getElementById("username-display");
	usernameDisplay.innerHTML = username;
}
// Function to display the list of mail in inbox
async function displayMailList(fetchInboxMail) {
	let inboxMails = await fetchInboxMail.json();
	mailList.replaceChildren();
	var inboxList = inboxMails.inbox.reverse();
	inboxButton.innerHTML = `Inbox [${inboxList.length}]`;
	sentButton.innerHTML = "Sent";
	trashButton.innerHTML = "Trash";
	MessageListName = "from";
	for (let i = 0; i < inboxList.length; i++) {
		var sender = "from";
		createMessageList(inboxList, i, sender);
	}
	var startId = 0;
	displayOneMail(startId);
}
// Function to display the list of sent mail
async function displaySentMailList(fetchSentMail) {
	let mails = await fetchSentMail.json();
	mailList.replaceChildren();
	var sentboxList = mails.sent.reverse();
	inboxButton.innerHTML = "Inbox";
	sentButton.innerHTML = `Sent [${sentboxList.length}]`;
	trashButton.innerHTML = "Trash";
	MessageListName = "to";
	for (let i = 0; i < sentboxList.length; i++) {
		var sender = "to";
		createMessageList(sentboxList, i, sender);
	}
	var startId = 0;
	displayOneMail(startId);
}
// Function to display the list of mails in trash
async function displayTrashMailList(fetchTrashMail) {
	let trashMails = await fetchTrashMail.json();
	mailList.replaceChildren();
	var trashBoxList = trashMails.trash.reverse();
	inboxButton.innerHTML = "Inbox";
	sentButton.innerHTML = "Sent";
	MessageListName = "trash";
	trashButton.innerHTML = `Trash [${trashBoxList.length}]`;
	for (let i = 0; i < trashBoxList.length; i++) {
		if ("from" in trashBoxList[i]) {
			console.log("hi");
			var sender = "from";
		} else {
			sender = "to";
		}
		createMessageList(trashBoxList, i, sender);
	}
	var startId = 0;
	displayOneMail(startId);
}
// Function to create a div for mail to display in the list
function createMessageList(messageBoxList, i, sender) {
	var mailInfo = document.createElement("div");
	var fromMailId = document.createElement("div");
	var subjectAndDate = document.createElement("div");
	var subject = document.createElement("div");
	var date = document.createElement("div");
	var messageAndTime = document.createElement("div");
	var message = document.createElement("div");
	var time = document.createElement("div");
	mailList.appendChild(mailInfo);
	mailInfo.setAttribute("class", "mail-info");
	mailInfo.setAttribute("id", `${i}-mail`);
	mailInfo.setAttribute("onclick", "getId(this.id)");
	fromMailId.setAttribute("class", "from-id");
	fromMailId.setAttribute("id", `${i}-from`);
	subjectAndDate.setAttribute("id", "subject-date");
	subjectAndDate.setAttribute("class", "subject-date");
	subject.setAttribute("class", "subject");
	subject.setAttribute("id", `${i}-subject`);
	date.setAttribute("id", "date");
	date.setAttribute("class", "date");
	messageAndTime.setAttribute("id", "message-time");
	messageAndTime.setAttribute("class", "message-time");
	message.setAttribute("class", "message");
	message.setAttribute("id", `${i}-message`);
	time.setAttribute("id", "time");
	time.setAttribute("class", "time");
	mailInfo.appendChild(fromMailId);
	if (sender == "from") {
		fromMailId.append(messageBoxList[i].from);
	} else {
		fromMailId.append(messageBoxList[i].to);
	}
	mailInfo.appendChild(subjectAndDate);
	subjectAndDate.appendChild(subject);
	subject.append(messageBoxList[i].sub);
	subjectAndDate.appendChild(date);
	date.append(messageBoxList[i].date);
	mailInfo.appendChild(messageAndTime);
	messageAndTime.appendChild(message);
	message.append(messageBoxList[i].content);
	messageAndTime.appendChild(time);
	time.append(messageBoxList[i].time);
}
// Function to get the id of the selected div of the mail.
function getId(clickedId) {
	displayOneMail(clickedId);
}
// Function to display the selected mail in the display mail column.
function displayOneMail(clickedId) {
	clickedNum = parseInt(clickedId);
	var subject = document.getElementById(`${clickedNum}-subject`).innerHTML;
	var from = document.getElementById(`${clickedNum}-from`).innerHTML;
	if (MessageListName == "from") {
		document.getElementById("from-mail-id").innerHTML = `From : ${from}`;
		document.getElementById("to-mail-id").innerHTML = `To : ${username}`;
	} else {
		document.getElementById("from-mail-id").innerHTML = `From : ${username}`;
		document.getElementById("to-mail-id").innerHTML = `To : ${from}`;
	}
	var message = document.getElementById(`${clickedNum}-message`).innerHTML;
	document.getElementById("subject-header").innerHTML = subject;
	document.getElementById("mail-box").innerHTML = message;
	reply.addEventListener("click", replyMail);
	function replyMail() {
		toAddress.value = from;
		SubjectContent.value = subject;
		messageContent.value = "";
		mailContainer.style = "display:block";
	}
}
