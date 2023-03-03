
window.onload=function(){
    getData("navigation",function(data){
        makeNav(data);
    });
    
    makeFooter();

    //-- sidebar
    var sidebar=document.getElementById("sidebar-container");
    $(document).on("click","#cart-icon",function(){
        
        if(sidebar.classList.contains("d-none")){
            sidebar.classList.remove("d-none");
            
        }
        else{
            sidebar.classList.add("d-none");
        }
       
    });

    window.addEventListener("click",function(event){
        if (event.target==sidebar) {
            sidebar.classList.add("d-none");
        }
    });
    
    $(document).on("click",".close-sidebar",function(){
        sidebar.classList.add("d-none");
    });

    //--index page
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
            addToCart((this).getAttribute("data-id"));
            updateProductNumber();
        });
    };


    //--about page
    if(window.location.href.indexOf("about.html")>-1){
        getData("staff",function(data){
            makeStaffDiv(data);
        });
    };

    //--contact page
    if(window.location.href.indexOf("contact.html")>-1){
        let date=document.getElementById("reservationDate");
        let now=new Date();
        let year = now.getFullYear();
        let month = (now.getMonth() + 1).toString().padStart(2, "0");
        let day = (now.getDate()+1).toString().padStart(2, "0");
        let currentDate = `${year}-${month}-${day}`;
        date.min=currentDate;

        
        $(document).on("change","#reservationTime",function(){
            checkTime($(this).val(),$(this));
        })

        $(document).on("blur", "#tbName",function(){
            reCheck(reName,$(this));
        });
        
        $(document).on("blur", "#tbPhone",function(){
            reCheck(rePhone,$(this));
        });

        $(document).on("blur", "#tbEmail",function(){
            reCheck(reEmail,$(this));
        });
        $(document).on("change", "#reservationDate",function(){
            checkDate($(this));
        });
        $(document).on("change", "#agreement",function(){
            agreementCheck($(this),$("#agreementText"));
        });
        $(document).on("click","#btnSubmit",function(){
            validateForm();
        });


    };
};


window.addEventListener("load", function() {
    const loader = document.getElementById("preloader");
    setTimeout(() => {
        loader.style.display = "none";
        document.getElementById("preloader").style.display = "none";
    }, 1500);
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
      var modal = document.getElementById("modal");
      $(document).on("click",".read-more",function(e){
        e.preventDefault();
        let id=$(this).data('id');
        fillModal(id);
        modal.style.display = "block";
      });
      $(document).on("click",".close-modal",function(){
        modal.style.display = "none";
      });
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
});


// -- functions
function getData(file,callback){
    $.ajax({
        url:"data/"+file+".json",
        method:"get",
        dataType:"json",
        success:callback,
        error:function(jqXHR, exception){
            var msg = '';
            if (jqXHR.status === 0) {
            msg = 'Not connecteded.\n Verify Network.';
            } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
            msg = 'Time out error.';
            } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
            } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            $("main").addClass("json-error");
            $("main").html(msg);
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


function addToCart(id){

    var ordered=[];
   
    if(getLS("cart")!=null){
        ordered=getLS("cart");
        if(alreadyInCart()){
            updateQty();
        }
        else{
            ordered.push({
                id:id,
                qty:1
            }); 
        }
    }
    else{
        ordered.push({
            id:id,
            qty:1
        });
    }
    

    function alreadyInCart(){
        return ordered.find(el=>el.id==id);
    }

    function updateQty(){
        for (let p of ordered) {
            if(p.id==id){
                p.qty++;
                break;
            }
        }
    }

    saveLS("cart",ordered);
}

function updateProductNumber(){

    let count=0;
    var ordered=getLS("cart");

    for(let p of ordered)
    {
        count+=p.qty;
    }

    document.getElementsByClassName("cart-count")[0].innerHTML= count;
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
            <p class="tm-gallery-title">Useful Links</p>
            <div id="usefull-link">
            <a href="rss.xml">RSS Sub</a>
            <a href="documentation.pdf">Documentation</a>
            <a href="author.html">Author</a>
            </div>`;
    $("footer").html(html);
}

function makeNav(data){
    let html=`<ul class="tm-nav-ul"> 
                <div id="cart-icon" class="cart-icon">
                    <i class="fa fa-shopping-cart"></i>
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
        <p class="tm-gallery-description">${it.description.substr(0,18)}<a href="#" class="read-more" data-id="${it.id}">...</a></p>
        <p class="tm-gallery-price">$` 
        html+=`${it.price.sm_price} `;
        html+=it.price.md_price==undefined ? "</p>" : `/ $${it.price.md_price} ` ;
        html+=it.price.lg_price==undefined ? "</p>" : `/ $${it.price.lg_price} </p> `;
        html+=`  </figcaption>
                <input type="button" value="Order now" class="tm-paging-link tm-mb-45 addToCartButtons" data-id="${it.id}">
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
    if(document.querySelector(`#${divId}`)){
        document.querySelector(`#${divId}`).innerHTML = html;
    }
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

function fillModal(id){
    let html="";
    let products=getLS("products");
    let i=id-1;
    html+=` <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="img/gallery/${products[i].image_url.href}" alt="${products[i].image_url.alt}"/>
                <h2>${products[i].name}</h2>
                <p>${products[i].description}</p>
            </div> `;

    $("#modal").html(html);
}

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
            if(value=="popularity"){
                return b.popularity - a.popularity;
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


reName=/^[A-ZŠĐŽČĆ][a-zšđčćž]{2,14}(\s[A-ZŠĐŽČĆ][a-zšđčćž]{2,14})+$/;
reEmail=/^[a-z0-9\.]+@[a-z]+\.[a-z]{2,3}$/;
rePhone=/^06\d{7,8}$/;

function addBorder(obj){
    obj.next('span').removeClass("d-none");
    obj.addClass("border-danger");
    return false;
}
function removeBorder(obj){
    obj.next('span').addClass("d-none");
    obj.removeClass("border-danger");
    return true;
}


function reCheck(re,obj){
    if(!re.test(obj.val())){
      return addBorder(obj)
  }
    else{
        return removeBorder(obj);
    }
}


function checkTime(value,obj){
    let min="10:00";
    let max="22:00";
    if(value>min && value<max){
        return removeBorder(obj);
    }
    else{
        return addBorder(obj);
    }
}

function agreementCheck(obj,label){
    if(obj.is(":checked")){
        label.removeClass("alert");
        return true;
    }
    else{
        label.addClass("alert");
        return false;
    }
}

function checkDate(obj){
    if(obj.val()==""){
        return addBorder(obj);
    }
    else{
        return removeBorder(obj);
    }
}

function validateForm(){

    let tbName=$("#tbName");
    let tbPhone=$("#tbPhone");
    let tbEmail=$("#tbEmail");
    let date=$("#reservationDate");
    let time=$("#reservationTime");
    let chb=$("#agreement");
    let brGresaka=0;
    !reCheck(reName,tbName) ? brGresaka++ : "";
    !reCheck(rePhone,tbPhone) ? brGresaka++ : "";
    !reCheck(reEmail,tbEmail) ? brGresaka++ : "";
    !checkTime($(time).val(),time) ? brGresaka++ : "";
    !checkDate(date) ? brGresaka++ : "";
    !agreementCheck(chb,$("#agreementText")) ? brGresaka++ : "";
    if(brGresaka==0){
        document.getElementById("contactForm").reset();
        document.getElementById("success").classList.remove("d-none");
        setTimeout(function timer(){
            document.getElementById("success").classList.add("d-none");
        },3000);
    }
}
