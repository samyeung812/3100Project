// =================  Components in Login Page  ================= //
const loginPage = document.getElementById("login-page");

// Login Form
const loginWrapper = document.getElementById("login-wrapper");
const loginBox = document.getElementById("login-box");
const loginUsernameError = document.getElementById("login-username-error");
const loginPasswordError = document.getElementById("login-password-error")
const createBtn = document.getElementById("create-button");
const forgetBtn = document.getElementById("forget-button");

// Registration Form
const registrationWrapper = document.getElementById("registration-wrapper");
const registrationBox = document.getElementById("registration-box");
const registerUsernameError = document.getElementById("register-username-error");
const registerPasswordError = document.getElementById("register-password-error");
const registerEmailError = document.getElementById("register-email-error");
const registerConfirmPasswordError = document.getElementById("register-confirm-password-error");

const closeCreateBtn = document.getElementById("close-create-button");

// Forget Form
const forgetWrapper = document.getElementById("forget-wrapper");
const forgetBox = document.getElementById("forget-box");
const forgetUsernameError = document.getElementById("forget-username-error");
const closeForgetBtn = document.getElementById("close-forget-button");

// =================  Components in Home Page  ================= //
const homePage = document.getElementById("home-page");

// Main Menu
const menuWrapper = document.getElementById("menu-wrapper");
const rankingBtn = document.getElementById("ranking-button");
const openRoomBtn = document.getElementById("open-button");
const joinBtn = document.getElementById("join-button");
const leaderboardBtn = document.getElementById("leaderboard-button");
const battlelogBtn = document.getElementById("battlelog-button");
const friendBtn = document.getElementById("friend-button");
const friendNotification = document.getElementById("friend-notification");
const settingBtn = document.getElementById("setting-button");

// Setting Menu
const settingWrapper = document.getElementById("setting-wrapper");
const usernameBox = document.getElementById("username-box");
const logoutBtn = document.getElementById("logout-button");
const changePasswordBtn = document.getElementById("change-password-button");
const changeEmailBtn = document.getElementById("change-email-button");
const closeSettingBox = document.getElementById("close-setting-button");

// Change Password Form
const changePasswordWrapper = document.getElementById("change-password-wrapper");
const changePasswordBox = document.getElementById("change-password-box");
const changeNewPasswordError = document.getElementById("change-new-password-error");
const changePasswordError = document.getElementById("change-password-error");
const changeConfirmPasswordError = document.getElementById("change-confirm-password-error")
const closeChangePasswordBtn = document.getElementById("close-change-password-button");

// Change Email Form
const changeEmailWrapper = document.getElementById("change-email-wrapper");
const changeEmailBox = document.getElementById("change-email-box");
const changeEmailError = document.getElementById("change-email-error");
const changeEmailPasswordError = document.getElementById("change-email-password-error");
const closeChangeEmailBtn = document.getElementById("close-change-email-button");

// Room
const roomWrapper = document.getElementById("room-wrapper");
const roomBox = document.getElementById("room-box");
const roomInfo = document.getElementById("room-information");
const roomIdInfo = document.getElementById("room-id");
const playersInfo = document.getElementById("players");
const spectatorsInfo = document.getElementById("spectators");
const startBtn = document.getElementById("start-button");
const spectateBtn = document.getElementById("spectate-button");
const playBtn = document.getElementById("play-button");
const leaveBtn = document.getElementById("leave-button");
const roomChatBtn = document.getElementById("room-chat-button");
const unreadRoomChat = document.getElementById("unread-room-chat");

// Join Room Form
const joinWrapper = document.getElementById("join-wrapper");
const joinBox = document.getElementById("join-box");
const joinRoomBtn = document.getElementById("join-room-button");
const joinError = document.getElementById("join-error");
const closejoinBtn = document.getElementById("close-join-button");

// Room Chat Form
const roomChatWrapper = document.getElementById("room-chat-wrapper");
const roomChatBox = document.getElementById("room-chat-box");
const closeRoomChatBtn = document.getElementById("close-room-chat-button");
const roomChatContent = document.getElementById("room-chat-content");

// Leaderboard
const leaderboardWrapper = document.getElementById("leaderboard-wrapper");
const leaderboardBox = document.getElementById("leaderboard-box");
const leaderboard = document.getElementById("leaderboard");
const closeLeaderboardBtn = document.getElementById("close-leaderboard-button");

// Battlelog
const battlelogWrapper = document.getElementById("battlelog-wrapper");
const battlelogBox = document.getElementById("battlelog-box");
const battlelog = document.getElementById("battlelog");
const closeBattlelogBtn = document.getElementById("close-battlelog-button");

// Friend
const friendWrapper = document.getElementById("friend-wrapper");
const friendBox = document.getElementById("friend-box");
const pendingList = document.getElementById("pending-list");
const requestList = document.getElementById("request-list");
const friendList = document.getElementById("friend-list");
const blockList = document.getElementById("block-list");
const closeFriendBtn = document.getElementById("close-friend-button");

// Private Chat
const privateChatWrapper = document.getElementById("private-chat-wrapper");
const privateChatBox = document.getElementById("private-chat-box");
const privateChatName = document.getElementById("private-chat-name");
const closePrivateChatBtn = document.getElementById("close-private-chat-button");
const privateChatContent = document.getElementById("private-chat-content");

// Ranking Mode
const rankingWrapper = document.getElementById("ranking-wrapper");
const closeRankingModeBtn = document.getElementById("close-ranking-mode-button");

// Game Board
const gameBoard = document.getElementById("game-board");
const stats = document.getElementById("stats");
const statsUpdate = document.getElementById("stats-update");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const crystalsImg = document.getElementById("images");
const images = crystalsImg.getElementsByTagName("img");

// ==================================================================== //

// Session Storage of JTW
var sessionToken;

// User Information
var user;
var unreadRoomChatCnt = 0;
var friendNotificationCnt = 0;

// Game Storage
var updating = false;
var roomstate = null;
var nextRoomstate = null;
var gamestate = null;
var rankingChange = 0;
var dissolve_value;
var dissolved;

const socket = io();