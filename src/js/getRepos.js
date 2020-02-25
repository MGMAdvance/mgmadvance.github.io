function getRepos(username) {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.github.com/users/' + username + '/repos', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.response);
            data.forEach(function (data) {
                console.log(data);
                document.getElementById("repos").innerHTML = "<li><a href='" + data.html_url + "'><h3 class='project-name' itemprop='name'>" + data.name + "</h3></a></li>";
            });
            console.log(data[0].html_url);
            // for (i = 0; i <= data.; i++) {
            //     var li = "<li><a href='" + data[i].html_url + "'><h3 class='project-name' itemprop='name'>" + data[i].name + "</h3></a></li>";
            //     document.getElementsByClassName("recent")[0].innerHTML = li;
            // }
            console.log("Links criados!");
        } else {
            // We reached our target server, but it returned an error
            console.log("Deu erro aqui no request!");
        }
    }
    request.onerror = function () {
        // There was a connection error of some sort
        console.log("Deu erro ai irmão!");
    };

    request.send();
}