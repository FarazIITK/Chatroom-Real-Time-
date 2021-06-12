class Chatroom {
  constructor(room, username) {
    this.username = username;
    this.room = room;
    this.chats = db.collection("chats");
    this.unsub;
  }
  async addChat(message) {
    const now = new Date();
    const chat = {
      message,
      room: this.room,
      username: this.username,
      created_at: firebase.firestore.Timestamp.fromDate(now),
    };
    const response = await this.chats.add(chat);
  }
  getChats(callback) {
    this.unsub = this.chats
      .where("room", "==", this.room)
      .orderBy("created_at")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            //update the UI
            callback(change.doc.data());
          }
        });
      });
  }
  updateName(username) {
    this.username = username;
    localStorage.setItem("username", username);
  }
  updateRoom(room) {
    this.room = room;
    console.log("room updates");
    if (this.unsub) {
      this.unsub();
    }
  }
}

// setTimeout(() => {
//   chatroom.updateRoom("gaming");
//   //chatroom.updateName("salman");
//   chatroom.getChats((data) => {
//     console.log(data);
//   });
//   //chatroom.addChat("hello world");
// }, 3000);
