const divMovie = `
<div onclick="showDetails(true, '__title__')" class="card card-home">
    <img class="card-img-top" src="__src__" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">__top__. __title__</h5>
        </div>
</div>
`;

const divUrlInput = `
<div class="form-group">
    <input name="imageMovie" type="text" class="form-control m-input imageMovie" placeholder="Enter URL" required>
</div>
`;

const divImgDetails = `
<div class="carousel-item __active__">
     <img class="imageDetail d-block w-100" src="__src__" alt="slide">
</div>
`;

const htmlToElement = (html) => {
    const template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
};

const fetchApiDone = (json) => {
    let storage = window.localStorage
    let movies = JSON.stringify(json)
    storage.setItem('movies', movies)
    listMovies()
};

const listMovies = () => {
    let storage = window.localStorage
    let movies = JSON.parse(storage.getItem('movies'))
    const divList = document.getElementById("list")
    divList.innerHTML = ""
    movies.forEach((movie, i) => {
        let newDivMovie = divMovie
            .replace("__link__", movie.link)
            .replace("__src__", movie.img[0])
            .replace("__top__", i + 1)
            .replace("__description__", movie.description)
            .replace("__title__", movie.name)
        newDivMovie = newDivMovie.replace("__title__", movie.name)
        divList.appendChild(htmlToElement(newDivMovie));
    });
}

const fetchLocal = (url) => {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(new Response(xhr.response, { status: xhr.status }));
        };
        xhr.onerror = function () {
            reject(new TypeError("Local request failed"));
        };
        xhr.open("GET", url);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
    });
};

const fetchApiMovies = () => {
    fetchLocal("api/movies.json").then((response) =>
        response.json().then(fetchApiDone)
    );
};

const showHome = () => {
    const form = document.getElementById("form");
    const details = document.getElementById("details");
    const home = document.getElementById("home");
    form.className = "";
    details.className = "";
    home.className = "";
}

const showForm = (show) => {
    const form = document.getElementById("form");
    const details = document.getElementById("details");
    const home = document.getElementById("home");
    form.className = show ? "show" : "";
    details.className = "hide";
    home.className = show ? "hide" : "";
}

const showDetails = (show, title) => {
    const form = document.getElementById("form");
    const details = document.getElementById("details");
    const home = document.getElementById("home");
    form.className = "hide";
    details.className = show ? "show" : "";
    home.className = show ? "hide" : "";
    fillDetails(title)
}

const fillDetails = (title) => {
    cleanup()
    let storage = window.localStorage
    let movies = JSON.parse(storage.getItem('movies'));
    movies.forEach(movie => {
        if(movie.name === title){
            document.getElementById('detailsTitle').innerText = movie.name
            document.getElementById('detailsDescription').innerText = movie.description
            let imgContainer = document.getElementById('carousel-inner')
            movie.img.forEach((img, i) => {

                let divImg = divImgDetails.replace("__src__", img)
                if(i === 0){
                    divImg = divImg.replace("__active__", "active")
                } else{
                    divImg = divImg.replace("__active__", "")
                }
                imgContainer.innerHTML += divImg
            })
        }
    })
}

const cleanup = () => {
    document.getElementById('detailsTitle').innerText = ""
    document.getElementById('detailsDescription').innerText = ""
    document.getElementById('carousel-inner').innerHTML = ""
}

document.querySelector("#form").addEventListener("submit", function(e){
        e.preventDefault()
        saveMovie()
});

const saveMovie = () => {
    const title = document.getElementById("inputTitle").value
    const description = document.getElementById("inputDescription").value
    const files = Array.from(document.getElementsByClassName('imageMovie'))
    const fileArray = [];
    files.forEach((file) => {
        fileArray.push(file.value)
    })
    let newMovie = {name: title, img: fileArray, description: description}
    let storage = window.localStorage
    if(storage.getItem('movies') !== null){
        let movies = storage.getItem('movies')
        movies = JSON.parse(movies)
        movies.push(newMovie)
        movies = JSON.stringify(movies)
        storage.setItem('movies', movies)
    }
    else{
        let baseArray = []
        baseArray.push(newMovie)
        baseArray = JSON.stringify(baseArray)
        storage.setItem('movies', baseArray)
    }
    listMovies();
    showForm(false);
    return false
}

const newURL = () => {
   let container = document.getElementById("url-container")
    container.innerHTML += divUrlInput
}

if ("cordova" in window) {
    document.addEventListener("deviceready", fetchApiMovies);
} else {
    document.addEventListener("DOMContentLoaded", fetchApiMovies);
}
