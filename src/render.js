const chokidar = require('chokidar');
const fs = require("fs");
const ini = require("ini");


const songListElement = document.getElementById("songList");
const pathInput = document.getElementById("pathInput");
const button = document.getElementById("saveButton");
const currentSongElement = document.getElementById("currentSong");

let songs = []
let currentSong
let currentSongFile = "";
settings = {}
let gameLocation;


function SaveSettings() {
    fs.writeFile("settings.ini", ini.encode(settings), (e) => {
    })
}


LoadSettings()
function LoadSettings() {
    fs.readFile("settings.ini", "utf8", (error, file) => {
        if (error) {
            //SaveSettings()
        } else {
            settings = ini.parse(file);
            currentSongFile = settings.currentSongFile;
            gameLocation = settings.gameLocation
            StartWatch()
        }
    })
    loadFavourites();
}





button.addEventListener("click", (a) => {
    if (currentSongFile == "") return

    songexists = false


    if (songs == null || songs[0] == null) { } else {
        songs.map(e => {
            if (e.title == currentSong.title && e.artist == currentSong.artist && e.charter == currentSong.charter) {
                console.log("Song is already in favourites");
                songexists = true;
            }
        })
    }

    if (songexists == false) {
        songs.push(currentSong);
        console.log(songs, currentSong)
        saveFavourites(songs);
        showList()
    }
})



function saveFavourites(content) {
    content = JSON.stringify(content)
    fs.writeFile(gameLocation + "favourites.json", content, (e) => {
    }

    )
}


function loadFavourites() {
    fs.readFile(gameLocation + "favourites.json", "utf-8", (error, file) => {
        if (error) {
        } else {
            songs = JSON.parse(file);
            showList()
            console.log(songs)
        }
    })

}


function showList() {
    if (songs == [] || songs[0] == null) {
        emptyList()
        return
    }
    emptyList()
    songs.forEach((e, index) => {
        createListItem(e.title, e.artist, e.charter, index)
    });


}

function createListItem(title, artist, charter, index) {
    let li = document.createElement("li");
    let deleteButton = document.createElement("p");
    let text = document.createElement("p");

    deleteButton.textContent = "\u2715";

    text.textContent = title + " - " + artist + " - " + charter;

    li.className = "listItem";
    deleteButton.className = "deleteButton";
    text.className = "textClass";

    li.appendChild(text);
    li.appendChild(deleteButton);


    songListElement.append(li);
}

function emptyList() {
    var child = songListElement.lastElementChild;
    while (child) {
        songListElement.removeChild(child);
        child = songListElement.lastElementChild;
    }
}

//delete from songs
document.body.addEventListener("click", (e) => {
    if (e.target.className == "deleteButton") {
        songs.splice(e.target.id, 1)
        saveFavourites(songs)
        showList()
    }
})

pathInput.addEventListener("input", e => {
    if (e.target.files[0] == null) return
    if (e.target.files[0].name == "currentsong.txt") {
        currentSongFile = e.target.files[0].path;
        gameLocation = currentSongFile.toString().slice(0, -15);

        settings.currentSongFile = currentSongFile
        settings.gameLocation = gameLocation;
        //SaveSettings();

        StartWatch()
        loadFavourites()
    } else {
        alert("Not currentsong.txt");
    }

})

function StartWatch() {
    chokidar.watch(currentSongFile).on("all", (event, path) => {
        fs.readFile(currentSongFile, "utf8", (a, file) => {
            if (file == "") return;
            if (file) {
                var text = file.split("\r\n")
                currentSong = ({ title: text[0], artist: text[1], charter: text[2] })
                currentSongElement.textContent = currentSong.title + " - " + currentSong.artist + " - " + currentSong.charter
            }
        })
    })
}