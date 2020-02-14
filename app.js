document.getElementById("button").onclick = () => {
    getUsers(getRandomCountOfUsers()) //при нажании на кнопку вызовется getUsers и передасться рам-ое кол-во пользователей
}

const loader = document.getElementById("loader");
const button = document.getElementById("button");

function getRandomCountOfUsers() {
    return Math.floor(Math.random() * 101) // генерируем от 0 до 1000
}

function getUsers(usersCount) {
    loader.removeAttribute("hidden"); //при нажатии убираем атрибут что б появился прелоадер
    fetch(`https://randomuser.me/api/?results=${usersCount}`)
        .then(response => response.json())
        .then((json) => { // получаем ответ из API в виде JSON
            loader.setAttribute("hidden", "");
            button.setAttribute("hidden", "");
            let infoContainer = document.getElementById("info");
            const container = document.getElementById('accordion__main');

            json.results.forEach((user, index) => { //проходимся по всем обьектам json
                const {gender, phone, email, name, location, dob, registered, nat, picture} = user; // что бы не писать user.gender...
                const card = document.createElement('div');
                card.classList = 'card-body';
                let img = picture.large; // создаём дальше разметку которая будет добавлятся в html файл при каждом проходе, так же будет сразу заполнятся нужными нам данными
                const content = ` 
                    <li>
                    <div class="card">
                            <div id="collapse-${index}" class="collapse show" aria-labelledby="heading-${index}" data-parent="#accordion">
                              <div class="card-body">
                                <div>
                                <img src="${img}" alt="">
                                </div>
                                <div><b>Gender:</b> ${gender}</div>
                                <div><b>Full name:</b> ${name.title} ${name.first} ${name.last} </div>
                                <div><b>Phone:</b>${phone}</div>
                                <div><b>Email:</b>${email}</div>
                                <div><b>Address:</b>${location.state} ${location.city} ${location.street.name} ${location.street.number}</div>
                                <div><b>Day of Birthday:</b>${new Date(dob.date).toLocaleDateString()}</div>
                                <div><b>Registered:</b>${new Date(registered.date).toLocaleDateString()}</div>
                                <div><b>National:</b>${nat}</div>
                              </div>
                            </div>
                        </div>
                    </li>`;
                container.innerHTML += content;
            });

            function length(obj) { // фун-ция нахождения кол-ва пользователей
                return Object.keys(obj).length;}

            let countOfUsers = length(json.results)

            let list = json.results; // находим мужчина или женщина
            let male = 0;
            let female = 0;
            for (let i = 0; i < list.length; i++) {
                if (list[i].gender === "male") { // сравнимаем если одно то +1
                    male++;
                } else {
                    female++;
                }}

            whoMore = () => {
                return male > female ? "Мужчин больше" : "Женщин больше"
            };

            let nation = json.results;
            let result2 = [];
            for (let i = 0; i < nation.length; i++) {
                result2.push(nation[i].nat.toUpperCase()); //заполняем массив национальностями
            }

            let resultReduce = result2.reduce(function (acc, cur) { // находим совпадения
                if (!acc.hash[cur]) {
                    acc.hash[cur] = {[cur]: 1};
                    acc.map.set(acc.hash[cur], 1);
                    acc.result.push(acc.hash[cur]);
                } else {
                    acc.hash[cur][cur] += 1;
                    acc.map.set(acc.hash[cur], acc.hash[cur][cur]);
                }
                return acc;
            }, {
                hash: {},
                map: new Map(),
                result: []
            });

            let resultSort = resultReduce.result.sort(function (a, b) {
                return resultReduce.map.get(b) - resultReduce.map.get(a);
            });


            let resultNational = []; // форматируем предыдущий результат фильтрации для удобного вовода информации
            for (let i in resultSort) {
                for (key in resultSort[i]) {
                    resultNational += `<div> ${key + ": " + resultSort[i][key]} </div>`
                }
            }
            // выводим данные
            const info = `
                    <div class="info">
                         <h5>INFO</h5>
                        <div>Count: ${countOfUsers}</div>
                        <div>Male: ${male} Female: ${female}</div>
                        <div>${whoMore()}</div>
                        <div>${resultNational}</div>
                    </div>
                `;
            infoContainer.innerHTML = info;
        })
};



