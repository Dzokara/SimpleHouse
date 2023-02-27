
window.onload=function(){
    getData("navigation",function(data){
        makeNav(data);
    });
    
    makeFooter();

    // let cartIcon = document.getElementById("cart-icon");
    // let sidebar = document.getElementById("sidebar");
    // cartIcon.addEventListener("click", () => {
    //     sidebar.style.display = "block";
    // });

    // sidebar.addEventListener("click", (event) => {
    //     if (event.target === sidebar) {
    //         sidebar.style.display = "none";
    //     }
    // });

    if(window.location.href.indexOf("index.html")>-1|| window.location.href.endsWith("/")){
        getData("dish_types",function(data){
            makeDdl(data,"dishesSelect","filter","Dish types","dishes");
            saveLS("dish_types",data);
        });
        getData("products",function(data){
            makeShop(data);
            saveLS("products",data);
        });
        
        getData("food_categories",function(data){
            makeDdl(data,"foodsSelect","filter","Food types","foods");
            saveLS("categories",data);
        });
       
        getData("sort",function(data){
            makeDdl(data,"sortSelect","sort","Sort by","sort");
        });
        $(document).on("change", "#foodsSelect", filterSync);
        $(document).on("change", "#dishesSelect", filterSync);
        $(document).on("change", "#sortSelect", filterSync);
        $(document).on("click", "#veganBtn",function(){
            isButtonClicked();
            filterSync();
        });
        $(document).on("click", ".addToCartButtons",function(){
            showNotification();
        });
    };
    
    if(window.location.href.indexOf("about.html")>-1){
        getData("staff",function(data){
            makeStaffDiv(data);
        });
    };
    if(window.location.href.indexOf("contact.html")>-1){
        let date=document.getElementById("reservationDate");
        let time=document.getElementById("reservationTime");
        let now=new Date();
        let year = now.getFullYear();
        let month = (now.getMonth() + 1).toString().padStart(2, "0");
        let day = now.getDate().toString().padStart(2, "0");
        let currentDate = `${year}-${month}-${day}`;
        date.min=currentDate;
        time.min="09:00";
        time.max="21:00";
    };
};

function getData(file,callback){
    $.ajax({
        url:"data/"+file+".json",
        method:"get",
        dataType:"json",
        success:callback,
        error:function(xhr){
            console.log(xhr);
        }
    });
}
function showNotification() {
    var notification = document.getElementById("notification");
    notification.style.display = "block";
    setTimeout(function() {
      notification.style.display = "none";
    }, 3000); 
  }
  

function isButtonClicked(){
    btn=document.getElementById("veganBtn");
    if (btn.classList.contains("clicked")) {
        btn.classList.remove("clicked");
    }
    else{
        btn.classList.add("clicked");
    }
}

function saveLS(name, value){
    localStorage.setItem(name, JSON.stringify(value));
}

function getLS(name){
    return JSON.parse(localStorage.getItem(name));
}

function makeFooter(){
    let html="";
    html+=`<p>&copy; 2023 All Rights Reserved By ICT College</p>
            <hr/>
            <p class="tm-gallery-title"><a href="documentation.pdf">Documentation</a></p>`;
    $("footer").html(html);
}

function makeNav(data){
    let html=`<ul class="tm-nav-ul"> 
                <div class="cart-icon">
                    <i id="cart-icon" class="fa fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                </div>`;
    for (let it of data) {
        html+=`<li class="tm-nav-li"><a href="${it.href}" class="tm-nav-link">${it.title}</a></li>`
    }

	html+=`</ul>`;
    
    $("#navlinks").html(html);

    let currentPage=0;
    if(window.location.href.endsWith("/")){
        document.querySelectorAll("#navlinks .tm-nav-li a")[currentPage].classList.add("active");
    }
    else{
        for (let it of data) {
            if (window.location.href.indexOf(it.href) > -1) {
                document.querySelectorAll("#navlinks .tm-nav-li a")[currentPage].classList.add("active");
            }
            else{
                currentPage++;
            }
        }
    }
    
}

function makeShop(data){
    let html="";
    if (data.length==0) {
        document.getElementById("tm-gallery-page-pizza").classList.add("justify-content-center");
        html+=`<h3 class="tm-mb-45">Oops, seems like none of our food matches your selection, send us your suggestions!</h3>
        `
    }
    else{
        document.getElementById("tm-gallery-page-pizza").classList.remove("justify-content-center");
    for (let it of data) {
        html+=`  <article class="col-lg-3 col-md-4 col-sm-6 col-12 tm-gallery-item">
                    <figure>
                        <img src="img/gallery/${it.image_url.href}" alt="${it.alt}" class="img-fluid tm-gallery-img" />
                        <figcaption>
                            <h4 class="tm-gallery-title">${it.name}</h4>
                            <p class=tm-gallery-price>`;
        html+=it.vegan ? "Vegan, " : "";
        html+=getDishType(it.typeid,"dish_types");
        html+=`</p>
        <p class="tm-gallery-description">${it.description}</p>
        <p class="tm-gallery-price">$` 
        html+=`${it.price.sm_price} `;
        html+=it.price.md_price==undefined ? "</p>" : `/ $${it.price.md_price} ` ;
        html+=it.price.lg_price==undefined ? "</p>" : `/ $${it.price.lg_price} </p> `;
        html+=` <input type="button" value="Order now" class="tm-paging-link tm-mb-45 addToCartButtons"> </figcaption>
                </figure>
            </article>`;
    }
}

  $("#tm-gallery-page-pizza").html(html);
}

function getDishType(id,data){
    let html="";
    dataLS=getLS(data);
    for (let it of dataLS) {
        if(it.id==id){
            html=it.name;
            break;
        }
    }
    return html;
}

// function makeFilterAndSortArea(data){
//     let html="";
//     for (let it of data) {
//         html+=`<li id="${it.name.toLowerCase()}Btn" class="tm-paging-item"><button type="button" class="tm-paging-link">${it.name}</button></li>`
//     }
//     html+=`<select name="ddlSort" id="ddlSort">
    
//     </select>`
//     $("#filters").html(html);
   
// }
//<li id="dropdown-button" class="tm-paging-item">
//            <a href="#" class="tm-paging-link">Sort By &#8595</a>
//        <div class="dropdown-content">
//        </div>
//    </li>
function makeDdl(data,id,type,defaultVal,divId){
    let html = `
    <select class="tm-paging-item" id="${id}">
        <option value="0">${defaultVal}</option>`;
        for(let it of data){
            if(type == "sort"){
                html += `<option value="${it.value}">${it.text}</option>`
            }
            else{
                html += `<option value="${it.id}">${it.name}</option>`
            }
        }
    html += `</select>`;

document.querySelector(`#${divId}`).innerHTML = html;
}
function socialsCheck(social,className,link){
    let html="";

    html+=social ? `<a href="${link}" class="tm-social-link"><i class="fab fa-${className} tm-social-icon"></i></a>` : "";

    return html;
}
function makeStaffDiv(data){
    let html="";
    for (let it of data) {
        html+=`
        <article class="col-lg-6">
        <figure class="tm-person">
            <img src="img/${it.image.src}" alt="${it.image.alt}" class="img-fluid tm-person-img" />
            <figcaption class="tm-person-description">
                <h4 class="tm-person-name">${it.name.fName} ${it.name.lName}</h4>
                <p class="tm-person-title">${it.function}</p>
                <p class="tm-person-about">${it.about}</p>
                <div>
                ${socialsCheck(it.socials.facebook,"facebook","https://fb.com")}
                ${socialsCheck(it.socials.twitter,"twitter","https://twitter.com/")}
                ${socialsCheck(it.socials.instagram,"instagram","https://www.instagram.com/")}
                ${socialsCheck(it.socials.youtube,"youtube","https://www.youtube.com/")}
                </div>
                </figcaption>
                </figure>
                </article>
                `
    }
    $("#staff").html(html);
}


window.addEventListener("load", function() {
    const loader = document.getElementById("preloader");
    setTimeout(() => {
        loader.style.display = "none";
        document.getElementById("preloader").style.display = "none";
    }, 2000);
    });

$(document).ready(function() {
  $(window).scroll(function() {
      if ($(this).scrollTop() > 250) {
          $('#return-to-top').fadeIn();
      } else {
          $('#return-to-top').fadeOut();
      }
  });

  $('#return-to-top').click(function() {
      $('html, body').animate({scrollTop : 0},800);
      return false;
  });
});

function sort(data){
    value=document.getElementById("sortSelect").value;
    if (value==0) {
        return data;
    }
    else{
        data.sort((a,b)=>{
            if(value=="price-asc")
                return a.price.sm_price - b.price.sm_price;

            if (value=="price-desc") {
                return b.price.sm_price - a.price.sm_price;
            }

            if(value=="name-asc"){
                if(a.name < b.name){
                    return -1;
                }
                
                else if(a.name > b.name){
                    return 1;
                }

                else{
                    return 0;
                }
            }

            if(value=="name-desc"){
                if(a.name > b.name){
                    return -1;
                }
                else if(a.name < b.name){
                    return 1;
                }
                else{
                    return 0;
                }
            }
        })
    return data;
    }
}

function filterFood(data,type){
    var filterProperty;
    if (type=="foods") {
        filterProperty="categoryid"
        currentValue=document.getElementById("foodsSelect").value;
    }
    else
    {
        filterProperty="typeid"
        currentValue=document.getElementById("dishesSelect").value;
    }
    if(currentValue!=0){
        return data.filter(x=> x[filterProperty] == currentValue);
    }
    else{
        return data;
    }

}

function filterVegan(data){

   if(document.getElementById("veganBtn").classList.contains("clicked"))
        return data.filter(x=>x.vegan==true);
    else  return data;
}

function filterSync(){

    let products=getLS("products");
    products=filterFood(products,"foods");
    products=filterFood(products,"dish");
    products=filterVegan(products);
    sort(products);

    makeShop(products);
}