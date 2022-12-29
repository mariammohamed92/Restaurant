$(document).ready(function() {
    new WOW().init();

    $('#loading').fadeOut(1000, function() {
        $('body').css('overflow', 'visible');
    });
    $('.aside-menu .toggle-btn').click(function() {
$('.aside-menu .nav-item').removeClass('fadeOutLeftBig').removeClass('fadeInUpBig');
        let toggleStatus = $(this).attr('menu-expanded');
        if(toggleStatus === 'false') {
        $('.aside-menu').animate({left: '0'}, 500);
        $('.aside-menu .nav-item').addClass('fadeInUpBig');
        $(this).attr('menu-expanded','true');
        }
        else {
        $('.aside-menu .nav-item').addClass('fadeOutLeftBig');
        setTimeout(() => {
            closeMenu.call(this);
        },300);
        }
    });
    $('.aside-menu .nav-item').click(function() {
        let navigate = $(this).text().trim();
$('#loading').fadeIn(500, function() {
        switch(navigate) {
            case 'search':
            renderSearchSection();
            break;
            case 'categories':
            getCategoryList();
            break;
            case 'area':
            getAreaList();
            break;
            case 'ingredients':
            getIngredientList();
            break;
            default:
            rendeContatSection();
        }
        }).fadeOut(500, function() {
            closeMenu.apply($('.toggle-btn'));
        });
    });
    function closeMenu() {
        $('.aside-menu').animate({left: '-250px'}, 500);
        $(this).attr('menu-expanded', 'false');
    }
    let getMeals = async function (name = '')  {
        let response = await fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        let data = await response.json();
        let meals = data.meals;
        renderCurrentMeals(meals);
    }
    getMeals();

});







let renderCurrentMeals = (meals, route) => {
    let sectionContent = '',
        cards = '';
    meals.map((meal) => {
        cards += 
        `<div class="col-sm-6 col-md-4 col-lg-3">
            <div class="item m-2" id="${meal.idMeal}">
            <img src="${meal.strMealThumb}" alt="Meal Thumbnail"/>
            <div class="item-overlay">
                <h3>${meal.strMeal}</h3>
            </div>
            </div>
        </div>`          
    }); 
    if(route === 'search') {
        document.querySelector('#mealsContainer').innerHTML = cards;
    }else {
        sectionContent = 
        `<section id="homeSection">
            <div class="container py-5">
            <div class="row py-5 m-4 g-4" id="mealsContainer">
                ${cards}
            </div>
            </div>
        </section>`;
        document.querySelector('main').innerHTML = sectionContent;
    }
    let items = Array.from(document.querySelectorAll('.item'));
    items.map((item) => {
        item.addEventListener('click', () => {
        getMealDetails(item.id);
        })
    });
};

let getMealDetails = async (id) => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let data = await response.json();
    renderDetailsCard(data.meals[0]);
};

let renderDetailsCard = (meal) => {
    let tags = '',
    tagLabels = '',
        measureArr = [],
        ingredientsArr = [],
        recipeLabels = '';
    // Render Recipes Label
    Object.keys(meal).map((mealKey) => {
        if(mealKey.includes('strMeasure')) {
        measureArr.push(mealKey);
        }else if(mealKey.includes('strIngredient')) {
        ingredientsArr.push(mealKey);
        }
    });

    for(let i = 0 ; i < measureArr.length ; i++) {
        if(meal[measureArr[i]] && meal[measureArr[i]].trim().length > 0) {
        recipeLabels += 
            `<span class="badge my-3 mx-1 p-2 rounded-1">
            ${meal[measureArr[i]]} ${meal[ingredientsArr[i]]}
            </span>`;
        }
    };

    if(meal.strTags) {
        tags = meal.strTags.split(',');
        tags.map((tag) => {
        tagLabels += 
            `<span class="badge badge my-3 mx-1 p-2 rounded-1">
            ${tag}
            </span>`
        });
    }

    let mealCard = `
        <section id="detailsSection">
            <div class="container py-5">
                <div class="row py-5 m-4" id="detailsContainer">
                    <div class="col-md-6 mb-4">
                        <div class="meal-title">
                            <img src="${meal.strMealThumb}" class="img-fluid px-0 px-md-4" alt="Meal Image">
                            <h1 class="text-center my-3 fw-light">${meal.strMeal}</h1>
                </div>
            </div>
            <div class="col-md-6">
                <div class="meal-info">
                <h2 class="mb-3">Instructions</h2>
                <p>${meal.strInstructions}</p>
                <p>
                    <span class="text-bold">Area</span> : ${meal.strArea}
                </p>
                <p>
                    <span class="text-bold">Category</span> : ${meal.strCategory}
                </p>
                <div class="my-3">
                    <h2>Recipes :</h2>
                <div class="recipes">
                    ${recipeLabels}
                </div>
                </div>
                <div class="my-3">
                    <h2>Tages :</h2>
                    <div class="tags">
                    ${tagLabels}
                    </div>
                </div>
                <div class="links d-flex">
                    <a href="${meal.strSource}" target="_blank" class="btn btn-success m-2 ms-0">Source</a>
                    <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger my-2">Youtube</a>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>`;
    document.querySelector('main').innerHTML = mealCard;
};


function renderSearchSection() {
    let sectionContent = `
    <section id="searchSection">
        <div class="fixed-search">
        <div class="container px-5">
            <div class="row p-5">
            <div class="col-md-6">
                <input type="text" id='nameSearch' placeholder='search by name ..' class="w-100"/>
            </div>
                <div class="col-md-6">
                    <input type="text" id='letterSearch' placeholder='search by first letter ..' maxlength="1" class="w-100"/>
                    </div>
                </div>
            </div> 
        </div>
        <div class="container">
            <div class="row p-5">
                <div class="row m-4 g-4 mt-5 pt-5" id="mealsContainer">
                </div>
            </div>
        </div>
    </section>
    `;
    document.querySelector('main').innerHTML = sectionContent;

    let nameInput = document.getElementById('nameSearch'),
        letterInput = document.getElementById('letterSearch');

    nameInput.addEventListener('keyup', () => {
        getMealByName(nameInput.value);
    }); 
    letterInput.addEventListener('keyup', () => {
        getMealByLetter(letterInput.value);
    }); 
}

let getMealByName = async (name='') => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let data = await response.json();
    renderCurrentMeals(data.meals.slice(0,20),'search');
}

let getMealByLetter = async (letter='') => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let data = await response.json();
    renderCurrentMeals(data.meals.slice(0,20),'search');
}


let getCategoryList = async () => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php?`);
    let data = await response.json();
    renderCategorySection(data.categories);
}

function renderCategorySection(meals) {
    let sectionContent = '',
        cards = '';
    meals.map((meal) => {
    cards += 
        `<div class="col-md-6 col-lg-4 col-xl-3">
            <div class="item m-2" id="${meal.strCategory}">
                <img src="${meal.strCategoryThumb}" class="h-auto" alt="Category Thumbnail"/>
                <div class="item-overlay flex-column text-center p-3">
                <h3 class="pt-3">${meal.strCategory}</h3>
                <p class="px-4 pd-2">${meal.strCategoryDescription.slice(0,100)} ...</p>
                </div>
            </div>
        </div>`          
    }); 

    sectionContent = 
        `<section id="categorySection">
        <div class="container py-5">
            <div class="row py-5 m-4 g-4" id="mealsContainer">
            ${cards}
            </div>
        </div>
        </section>`;
    document.querySelector('main').innerHTML = sectionContent; 

    let items = Array.from(document.querySelectorAll('.item'));
    items.map((item) => {
        item.addEventListener('click', () => {
        filterByCategory(item.id);
        })
    });
}

let filterByCategory = async (category) => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let data = await response.json();
    renderCurrentMeals(data.meals.slice(0,20));
}


let getAreaList = async () => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=`);
    let data = await response.json();
    renderAreaSection(data.meals.slice(0,20));
}
    function renderAreaSection(areas) {
        let sectionContent = '',
        cards = '';

    areas.map((area) => {
        cards += 
        `<div class="col-md-6 col-lg-4 col-xl-3">
            <div class="item m-2 p-2" id="${area.strArea}">
                <i class="fa fa-city fa-2x m-3"></i>
                <h3 class="pt-3 text-white">${area.strArea}</h3>
            </div>
        </div>`          
}); 

    sectionContent = `
        <section id="areaSection">
            <div class="container p-5">
                <div class="row py-5 g-4" id="mealsContainer">
                ${cards}
                </div>
            </div>
        </section>
    `;
    document.querySelector('main').innerHTML = sectionContent; 

    let items = Array.from(document.querySelectorAll('.item'));
    items.map((item) => {
        item.addEventListener('click', () => {
        filterByArea(item.id);
        })
    });
}

let filterByArea = async (area) => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let data = await response.json();
    renderCurrentMeals(data.meals.slice(0,20));
}


let getIngredientList = async () => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=`);
    let data = await response.json();
    renderIngredientSection(data.meals.slice(0,20));
}

    function renderIngredientSection(list) {
        let sectionContent = '',
            cards = '';

    list.map((item) => {
        cards += 
        `<div class="col-md-6 col-lg-4 col-xl-3">
            <div class="item m-2 p-2" id="${item.strIngredient}">
            <i class="fa-solid fa-bowl-food fa-3x"></i>
                
                <h3 class="pt-2 mb-0 text-white">${item.strIngredient}</h3>
                <p class="p-3 text-white">${item.strDescription.slice(0,100)}..</p>
            </div>
        </div>`          
}); 

    sectionContent = 
        `<section id="ingredSection">
            <div class="container py-5">
                <div class="row py-5 m-4 g-4" id="mealsContainer">
                ${cards}
                </div>
            </div>
        </section>`;
    document.querySelector('main').innerHTML = sectionContent; 

    let items = Array.from(document.querySelectorAll('.item'));
    items.map((item) => {
        item.addEventListener('click', () => {
        filterByIngredients(item.id);
})
    });
}

let filterByIngredients = async (name) => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`);
    let data = await response.json();
    renderCurrentMeals(data.meals.slice(0,20));
}



let rendeContatSection = () => {
    let sectionContent = 
        `<section id="contactSection">
            <div class="container px-5">
                <div class="row align-content-center text-center h-100">
                    <h2 class="mb-5 pb-2">Contact Us...</h2>
                    <form class="row w-75 m-auto">
                        <div class="col-md-6 mb-2">
                            <input type="text" name="name" id="nameInput" class="form-control" placeholder="Enter Your Name">
                            <div id="nameAlert" class="alert alert-danger d-none" role="alert">
                            Special Characters and Numbers not allowed
                            </div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <input type="email" name="email" id="emailInput" class="form-control" placeholder="Enter Email">
                            <div id="emailAlert" class="alert alert-danger d-none" role="alert">
                            Please Enter valid email. *Ex: xxx@yyy.zzz
                        </div>
                    </div>
                <div class="col-md-6 mb-2">
                    <input type="tel" name="phone" id="phoneInput" class="form-control" placeholder="Enter Phone">
                    <div id="phoneAlert" class="alert alert-danger d-none" role="alert">
                    Please Enter valid Phone Number
                    </div>               
                </div>
                <div class="col-md-6 mb-2">
                    <input type="number" name="age" id="ageInput" class="form-control" placeholder="Enter Age">
                    <div id="ageAlert" class="alert alert-danger d-none" role="alert">
                    Please Enter valid Age
                    </div> 
                </div>
                <div class="col-md-6 mb-2">
                    <input type="password" name="password" id="passwordInput" class="form-control" placeholder="Enter Password">
                    <div id="passwordAlert" class="alert alert-danger d-none" role="alert">
                     Please Enter valid password *Minimum 8 characters, at least one letter and one number:*
                    </div>
                </div>
                <div class="col-md-6 mb-2">
                    <input type="password" name="re-password" id="repasswordInput" class="form-control" placeholder="enter RePassword">
                    <div id="repasswordAlert" class="alert alert-danger d-none" role="alert">
                    Password & RePassword must be matched
                    </div>
                </div>
                <div>
                    <button id="submitBtn" class="btn btn-outline-danger my-2 px-3 py-2" disabled>Submit</button>
                </div>
                </form>
            </div>
            </div>
        </section>`;
    document.querySelector('main').innerHTML = sectionContent; 
    pressInputEvent();
}

let pressInputEvent = () => {

    document.querySelector('#nameInput').addEventListener('keyup', function() { 
        let regex = /^[a-zA-Z]{1,30}$/,
            alert = document.querySelector('#nameAlert');
        checkValidation(this, regex, alert);
    });
    document.querySelector('#emailInput').addEventListener('keyup', function() {
        let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            alert = document.querySelector('#emailAlert');
        checkValidation(this, regex, alert);
    });
    document.querySelector('#phoneInput').addEventListener('keyup', function() {
        let regex = /^01[0125][0-9]{8}$/,
            alert = document.querySelector('#phoneAlert');
        checkValidation(this, regex, alert);
    });

    document.querySelector('#ageInput').addEventListener('keyup', function() { 
        let regex = /^[1-9][0-9]?$/,
            alert = document.querySelector('#ageAlert');
        checkValidation(this, regex, alert);
    });

    document.querySelector('#passwordInput').addEventListener('keyup', function() {
        let regex = /^(?=.*[0-9])(?=.*[a-z])([a-z0-9_-]+){8,}$/,
            alert = document.querySelector('#passwordAlert');
        checkValidation(this, regex, alert);
    });

    document.querySelector('#repasswordInput').addEventListener('keyup', function() {
        let alert = document.querySelector('#repasswordAlert'),
            passwordInput = document.querySelector('#passwordInput');
        if(this.value !== passwordInput.value) {
        handleValidationStyle(this, alert, 'invalid');
        }else {
        handleValidationStyle(this, alert, 'valid');
        }
        checkSubmitAction();
    });
}

let checkValidation = (input, regex, alert) => {
    if(!input.value.match(regex)) {
        handleValidationStyle(input, alert, 'invalid');
    }else {
        handleValidationStyle(input, alert, 'valid');
    }
    checkSubmitAction();
}

let handleValidationStyle = (input,alert,valid) => {
    if(valid == 'invalid') {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        alert.classList.remove('d-none');
        alert.classList.add('d-block');
    }else {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        alert.classList.remove('d-block');
        alert.classList.add('d-none');
    }
}

let checkSubmitAction = () => {
    let inputs = Array.from(document.querySelectorAll('input')),
        submitBtn = document.querySelector('#submitBtn');
    inputs.filter(input => input.classList.contains('is-valid')).length == inputs.length ? 
        submitBtn.disabled = false : submitBtn.disabled = true;
}


























