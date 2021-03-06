document.getElementById("button").onclick = () => {
    getUsers(getRandomCountOfUsers()) //при нажании на кнопку вызовется getUsers и передасться рам-ое кол-во пользователей

}


const loader = document.getElementById("loader");
const button = document.getElementById("button");


function getRandomCountOfUsers() {
    return Math.floor(Math.random() * 101) // генерируем от 0 до 1000

}

function getUsers(usersCount) {
    button.setAttribute("hidden", "");
    loader.removeAttribute("hidden"); //при нажатии убираем атрибут что б появился прелоадер
    fetch(`https://randomuser.me/api/?results=${usersCount}`)
        .then(response => response.json())
        .then((json) => { // получаем ответ из API в виде JSON
            loader.setAttribute("hidden", "");

            document.getElementById("sort").hidden = false;
            document.getElementById("input").hidden = false;


            let infoContainer = document.getElementById("info");
            const container = document.getElementById('accordion__main');

            json.results.forEach((user, index) => { //проходимся по всем обьектам json
                const {gender, phone, email, name, location, dob, registered, nat, picture} = user; // что бы не писать user.gender...
                const card = document.createElement('div');
                card.classList = 'card-body';
                let img = picture.large; // создаём дальше разметку которая будет добавлятся в html файл при каждом проходе, так же будет сразу заполнятся нужными нам данными
                const content = ` 
                    <li class="users">
                    <div class="card">
                    <div class="full__name"><b>Full name:</b> <code> ${name.first} ${name.last}</code> </div>
                    <div class="image">
                        <img src="${img}" alt="">
                    </div>
                    <div class="filterDiv gender"><b>Gender:</b> <code> ${gender}</code></div>
                    <div class="phone"><b>Phone:</b> <code>${phone}</code></div>
                    <div class="email"><b>Email:</b> <code>${email}</code></div>
                    <div class="address"><b>Address:</b> <code>${location.state} ${location.city} ${location.street.name} ${location.street.number}</code></div>
                    <div class="dob"><b>Day of Birthday:</b> <code> ${new Date(dob.date).toLocaleDateString()}</code></div>
                    <div class="registered"><b>Registered:</b> <code> ${new Date(registered.date).toLocaleDateString()}</code></div>
                    <div class="national"><b>National:</b> <code> ${nat}</code></div>
                        </div>
                    </li>`;
                container.innerHTML += content;
            });

            function length(obj) { // фун-ция нахождения кол-ва пользователей
                return Object.keys(obj).length;
            }

            let countOfUsers = length(json.results)

            let list = json.results; // находим мужчина или женщина
            let male = 0;
            let female = 0;
            for (let i = 0; i < list.length; i++) {
                if (list[i].gender === "male") { // сравнимаем если одно то +1
                    male++;
                } else {
                    female++;
                }
            }

            whoMore = () => {
                if (male > female) {
                    return "Мужчин больше"
                } else if (female > male) {
                    return "Женщин больше"
                } else {
                    return "Женщин и мужчин поровну"
                }
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


function myFunction() {
    let input, filter, ul, li, a, i, txtValue, emailValue, phoneValue, b, c;
    input = document.getElementById('input');
    filter = input.value.toUpperCase();
    ul = document.getElementById("accordion__main");
    li = ul.getElementsByTagName('li');

    //перебираем все элементы и скрываем тех кто не подходит запросу
    for (i = 0; i < li.length; i++) {
        a = li[i].querySelector(".full__name");
        b = li[i].querySelector(".email");
        c = li[i].querySelector(".phone");
        txtValue = a.textContent || a.innerText;
        emailValue = b.textContent || b.innerText;
        phoneValue = c.textContent || c.innerText;
        
        if (txtValue.toUpperCase().includes(filter)
            || phoneValue.includes(filter)
            || emailValue.toUpperCase().includes(filter) ) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}


function sortList() {
    const list = document.getElementById('accordion__main');
    const items = list.childNodes;
    let itemsArr = [];
    for (let i in items) {
        if (items[i].nodeType == 1) {
            itemsArr.push(items[i]);
        }
    }

    itemsArr.sort(function (a, b) {
        return a.innerHTML == b.innerHTML
            ? 0
            : (a.innerHTML > b.innerHTML ? 1 : -1);
    });

    for (i = 0; i < itemsArr.length; ++i) {
        list.appendChild(itemsArr[i]);
    }
}
