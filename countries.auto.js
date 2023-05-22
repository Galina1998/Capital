function createStorage(){
    let countries=[];
    return{
        setCountries: newElement =>newElement=countries,
        getCountries:()=>countries
    }
}
let store=createStorage();

function buildAutocomplete(data){
        $( "#countries-list" ).autocomplete({
          source: data,
          select: function( event,ui ) {
            let searchValue=ui.item.value;
            let countriesBackup=store.getCountries();
            const buildResult=countriesBackup.filter(country=>country.name.common===searchValue)
            renderCountries(buildResult);
          }
        });

     
}


function renderCountries(countries){
    if(document.querySelector('.countries-table')) {
        document.querySelector('.countries-table').remove();
      }
    

let countriesTable=document.createElement(`table`);
    countriesTable.className='table table-bordered table-striped countries-table';
    let htmlStr=countries.reduce((acc,country)=>{
        return acc+`<tr>
        <td>${country.name.common}</td>
        <td>${country.name.official}</td>
        <td><img src="${country.flags.png}"class="image-top"></td>
        
        </tr>`},'');
        countriesTable.innerHTML=`<thead>
        <tr>
        <th data-sort="name">Name</th>
        <th data-sort="capital">Capital</th>
        <th data-sort="flag">Flag</th>
        
        </tr>
        </thead>
        <tbody> ${htmlStr} </tbody>`
    
        document.querySelector(`.container`).append(countriesTable);
        $(`tr`).mouseover(function(e){
            e.currentTarget.classList.add(`bg-warning`);
        })
        $(`tr`).mouseout(function(e){
            e.currentTarget.classList.remove(`bg-warning`);
        })
        document.querySelector(`table`).onclick=e=>{
            e.target.classList.toggle(`bg-danger`);
        }
        document.querySelector('table thead').onclick = e => {
         console.log(e.target.getAttribute('data-sort'))
            let field = e.target.getAttribute('data-sort');
            const countriesBackup = store.getCountries();
            countriesBackup.sort((countryA, countryB) => {
                if(countryA > countryB) {return 1} else {return -1}
         
            })
            renderCountries(countriesBackup);
            document.querySelector(`table thead [data-sort="${field}"]`).classList.add('bg-success'); 
          }
            

        }
        



fetch(' https://restcountries.com/v3.1/all ').then(res=>res.json()).then(function(data){
    console.log(data);
    renderCountries(data);
    store.setCountries(data);
buildAutocomplete(data.map(country=>country.name.common));
});