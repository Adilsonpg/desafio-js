// pegando dados da API

const api = {
    units: "metric",
    lang: "pt_br",
    key: "bf085de0eb055c99045a0585a523ac4b",
    urlBase: "https://api.openweathermap.org/data/2.5/",
}

// Requisitando localização do dispositivo

window.addEventListener('load', () => {
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(success);
    } else {    
        alert("Geolocalização não suportada");
    }
    function success(pos){
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        position(latitude, longitude);
    }
})

function position (latitude, longitude) {
    fetch(`${api.urlBase}weather?lat=${latitude}&lon=${longitude}&lang=${api.lang}&units=${api.units}&appid=${api.key}`)
    .then(response => response.json())   
    .then(response => {alteraDom(response)})      
}

// atribuindo variaveis para manipulação do DOM

const cidade = document.querySelector('.cidade')
const data = document.querySelector('.data')
const iconTempo = document.querySelector('.icon-tempo')
const clima = document.querySelector('.clima')
const temperatura = document.querySelector('.temp')
const medida = document.querySelector('.medida')
const min = document.querySelector('.min')
const max = document.querySelector('.max')

function alteraDom (result) {
    let now = new Date();
    data.innerText = formatDate(now);
    cidade.innerText = result.name;
    clima.innerText = result.weather[0].description;    
    temperatura.innerText = parseInt(result.main.temp)+'ºc';
    min.innerText = `min ${parseInt(result.main.temp_min)}ºc`;
    max.innerText = `máx ${parseInt(result.main.temp_max)}ºc`; 
    let iconName = result.weather[0].icon;
    iconTempo.setAttribute('src', './icons/tempo-icones/'+iconName+'.png');    
}

//-------------Formatando a data-----------------

function formatDate(d) {
    let dayName = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let monName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julio", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    var day = dayName[d.getDay()]; 
    var date = d.getDate();
    var month = monName[d.getMonth()];
    var year = d.getFullYear();
    var time = d.getHours() +"h:"+ d.getMinutes()+"m";
    return `${day}, ${date} ${month} ${year} ${time}`;     
}

// Função para salvar o clima

function salvarClima(){
    var dadosClima = {
        cid: cidade.innerText,
        dat: data.innerText,        
        cli: clima.innerText,
        temp: temperatura.innerText,        
        max: max.innerText,
        min: min.innerText,
        icon: iconTempo.outerHTML
    };    

    var dados = JSON.parse(localStorage.getItem("climaSalvo"));

    if (dados == null){
        localStorage.setItem('climaSalvo', '[]');
        dados = [];
    }   
    
    dados.push(dadosClima);
    localStorage.setItem('climaSalvo', JSON.stringify(dados));
      
    if(document.querySelector('.historico').hidden == false){
        mostrarClima();
    }
}

// Função para exibir a lista salva

function mostrarClima(){  
    var mostraClima = JSON.parse(localStorage.getItem('climaSalvo'));
    let tbody = document.querySelector('.tbody');
    tbody.innerText = '';
    let lista = []; 
    if (mostraClima === null){
        alert("Nenhum Clima Salvo")
    } else {
            for (let cont = 0; cont < mostraClima.length; cont++){  
                lista[cont] = mostraClima[cont];  
                let tr = tbody.insertRow();        
                let tdCidade = tr.insertCell();
                let tdTemp = tr.insertCell();
                let iconLsta = tr.insertCell(); 
                let tdClima = tr.insertCell();
                let tdData = tr.insertCell();
                let tdMm = tr.insertCell();   

                tdCidade.innerText = lista[cont].cid
                tdTemp.innerText = lista[cont].temp
                iconLsta.outerHTML = lista[cont].icon
                tdClima.innerText = lista[cont].cli
                tdData.innerText = lista[cont].dat 
                tdMm.innerText = lista[cont].min + ' / ' +lista[cont].max 
            }        
        }  
    if(document.querySelector('.historico').hidden == true){
        document.querySelector('.historico').hidden = false;
        document.querySelector('.btn-esconder').hidden = false;
        document.querySelector('.btn-mostrar').hidden = true;
    }          
}

// Função para esconder a lista salva

function esconderClima(){
    document.querySelector('.historico').hidden = true;
    document.querySelector('.btn-esconder').hidden = true;
    document.querySelector('.btn-mostrar').hidden = false;
}