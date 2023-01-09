// FIRESTORE BOILERPLATE --------------- //

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getFirestore,
  writeBatch,
  doc,
  collection,
  setDoc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCo7BBkUwWkWXJC7NesMXhOuqhhMPm7Aks",
  authDomain: "scully-62041.firebaseapp.com",
  projectId: "scully-62041"
  // storageBucket: "scully-62041.appspot.com",
  // messagingSenderId: "509144374223",
  // appId: "1:509144374223:web:da0bbaf821a66d3fa5d0ba",
  // measurementId: "G-GJB1BGNBSL"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
let userRef = collection(db, "user");
let libraryRef = collection(db, "library");
let bookRef = doc(libraryRef, "2OmTiTMuG4rCcuyowHWa");


const App = Vue.createApp({
  data() {
    return {
      user: "Will",
      booksList: [],
      msg: "",
      speech: "",
      bookResults: [],
      username: "",
      password: "",
      author: "",
      title: "",
      genre: "",
      book: {}
    };
  },
  computed: {
    userBookshelf() {
      var bookshelf = [];
      for (book of this.booksList) {
        for (i = 0; i < book.users.length; i++) {
          if (book.users[i] == this.user) {
            bookshelf.push(book);
          }
        }
      }
      return bookshelf;
    }
  },
  methods: {
    async addUser() {
      const docRef = await addDoc(userRef, {
        user: this.username,
        password: this.password
      });
    },
    async login() {
      let currentUser = this.currentUsername;
      console.log(currentUser);
      
    },
    resetInputs() {
      this.username = "";
      this.password = "";
    },
    readMe() {
      let msg = document.getElementById("inputText").value;
      let speech = new SpeechSynthesisUtterance();
      speech.lang = "en";
      speech.text = msg;
      speech.volume = 1;
      speech.rate = 0.9;
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
    },
    readText () {
			let doc = getDoc(bookRef)
				.then((doc) => {
					console.log(doc.data());
					this.book = doc.data();
				})
				.catch((error) => {
					console.log(error);
				});
		},
    searchBook() {
      console.log(this.booksList)
      this.bookResults = [];
      for (let i = 0; i < this.booksList.length; i++) {
        if(this.author){
          console.log("author", i, this.author, this.booksList[i].author.toLowerCase().includes(this.author.toLowerCase()))
          if(this.booksList[i].author.toLowerCase().includes(this.author.toLowerCase())){
            this.bookResults.push(this.booksList[i])
          }
        }
        if(this.title){
          console.log("title", i, this.title, this.booksList[i].title.includes(this.title))
          if(this.booksList[i].title.includes(this.title)){
            this.bookResults.push(this.booksList[i])
          }
        }
        if(this.genre){ 
          console.log("genre", i, this.genre, this.booksList[i].genre.includes(this.genre))
          if(this.booksList[i].genre.includes(this.genre)){
            this.bookResults.push(this.booksList[i])
          }
        }
        console.log("!this.author&&!this.title&&!this.genre",!this.author&&!this.title&&!this.genre)
        if(!this.author&&!this.title&&!this.genre){
          this.bookResults.push(this.booksList[i])
        }
      }
    },
  },
  mounted() {
    const q = query(libraryRef);
    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempBooksList = [];
      querySnapshot.forEach((doc) => {
        tempBooksList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      this.booksList = tempBooksList;
      this.bookResults = tempBooksList;
      this.readText();
    });
  }
});

App.component("book", {
  props: ["book"],
  data() {
    return {};
  },
  template: `
  <div class="box">
    <img :src="book.graphic">
    <p> {{ book.title }}</p>
    <p> {{ book.author }}</p>
    <p> {{ book.genre }}</p>
    <p> {{ book.text }}</p>
    <button class="button" @click="addReader"> Add to My Bookshelf </button>
    <button class="button" @click="readBook"> Read this Book </button>
  </div>`,
  methods: {
    addReader(book) {
      const bookRef = doc(db, "library", book.id);
      updateDoc(bookRef, {
        user: this.currentUser,
      });
    },
    readBook(book) {
      let msg = this.book.text;
      let speech = new SpeechSynthesisUtterance();
      speech.lang = "en";
      speech.text = msg;
      speech.volume = 1;
      speech.rate = 0.9;
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
      console.log(msg);
    }, 
},
}),
  
App.component("borrowed", {
  props: ["borrowed"],
  data() {
    return {};
  },
  template: `
  <div class="box">
    <img :src="book.graphic">
    <p> {{ book.title }}</p>
    <p> {{ book.author }}</p>
    <p> {{ book.genre }}</p>
    <button> Return to Library </button>
    <button>Read to Me</button> 
   </div>`
});


App.mount("#app");
