const navbar = document.getElementById('navbar');
const main = document.getElementById('main');

document.addEventListener('DOMContentLoaded', (ev) => {
    let hnav = navbar.clientHeight;
    main.style.height = `calc(100vh - ${hnav}px)`;
});

addEventListener('resize', ev => {
    let hnav = navbar.clientHeight;
    main.style.height = `calc(100vh - ${hnav}px)`
}, true)

const urlPm = "https://gsx2json.com/api?id=1I5lhzOh85F3y3RucS4XkiIreH0radExd3ZhTPO_jNPE&sheet=get-api-pm&columns=false";
const urlRps = "https://gsx2json.com/api?id=1I5lhzOh85F3y3RucS4XkiIreH0radExd3ZhTPO_jNPE&sheet=get-api-rps&columns=false";
const mainPanel = document.getElementById('main-panel')
const tanggalSekarang = document.getElementById('tanggal-now');
const tanggalBesok = document.getElementById('tanggal-besok');

setInterval(() => {
    tanggalSekarang.innerHTML = new Date().toLocaleString('id-ID').toLowerCase();
    tanggalBesok.innerHTML = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('id-ID');
},1000);

const getDataPM = () => {
    return fetch(urlPm).then(response => {
        return response.json();
    }).then(responseJson => {
        if(responseJson.rows){
            return Promise.resolve(responseJson.rows);
        }else{
            return Promise.reject(`data tidak ada...`)
        }
    })
}

const getDataRps = () => {
    return fetch(urlRps).then(response => {
        return response.json();
    }).then(resJson => {
        if(resJson.rows){
            return Promise.resolve(resJson.rows);
        }else{
            return Promise.reject(`data tidak ada...`)
        }
    })
}

const groupsData = (d) => {
    return d.reduce((lines, item) => ({
        ...lines,
        [item.Line]: [...(lines[item.Line] || []), item]
    }),{});
}
const renderResult = (dataRps, dataPM) => {
    const header = document.getElementById('header-rps');

    const { Rps, Rev } = dataPM['LINE A'][0];
    header.innerHTML = `<p>Rps ${Rps} Revisi-${Rev}</p>`;

    mainPanel.innerHTML = '';
    dataRps.map(data => {
        if(data.type === 'Line'){
            mainPanel.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h5>${data.title}</h5>
                    <div id="container-today-${data.title.toLowerCase().replace(/\s+/g, '-')
                    .replace(/\-\-+/g, '-')}">
                    </div>
                </div>
            </div>
            `;
        }
    });

    const Today = new Date().toLocaleDateString('id-ID',{weekday: 'long'});
    const T = new Date()
    T.setDate(new Date().getDate() + 1)
    const Tomorow = new Date(T).toLocaleDateString('id-ID',{weekday: 'long'});
    dataRps.forEach((data,index) => {
        if(data.type === 'Work Order'){
            if(data.hari === Today.toLocaleLowerCase() || data.hariDua === Today.toLocaleLowerCase()){
                const elem = document.getElementById(`container-today-${data.line.toLowerCase().replace(/\s+/g, '-')
                .replace(/\-\-+/g, '-')}`)
                let d = data.hari === Today.toLocaleLowerCase() ? 'chargis' : data.hariDua === Today.toLocaleLowerCase() ? 'chargisDua' : '';
                
                let status = dataPM[data.line];
                let color = 'bg-danger';
                status.map(s => {
                    if(s.bo === data.title){
                        color = s[Today] == data[d] ? 'bg-success' : 'bg-danger';
                    }
                })
    
                elem.innerHTML += `
                    <div class="card my-2">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-9">
                                    <p><span>${data.title}</span> | <span>${data.codeProduct}</span> | <span>${data[d]} cgs</span></p>
                                    
                                </div>
                                <div class="col-3 text-center">
                                    <span class="position-absolute translate-middle p-2 ${color} border border-light rounded-circle"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            if(data.hari === Tomorow.toLocaleLowerCase() || data.hariDua === Tomorow.toLocaleLowerCase()){
                const elem = document.getElementById('secondary-panel');
                let d = data.hari === Tomorow.toLocaleLowerCase() ? 'chargis' : data.hariDua === Tomorow.toLocaleLowerCase() ? 'chargisDua' : '';
                let status = dataPM[data.line];
                let color = 'bg-danger';
                status.map(s => {
                    if(s.bo === data.title){
                        color = s[Tomorow] == data[d] ? 'bg-success' : 'bg-danger';
                    }
                })

                elem.innerHTML += `
                    <div class="card m-2">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-9">
                                    <h6><span>${data.title}</span> | <span>${data.codeProduct}</span> | <span>${data[d]} cgs</span></h6>
                                    <p>${data.line}</p>
                                </div>
                                <div class="col-3 text-center">
                                    <span class="position-absolute translate-middle p-2 ${color} border border-light rounded-circle"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    });
    
}

const dataPM = dataRps => {
    getDataPM().then(res => groupsData(res)).then(response => {
        renderResult(dataRps,response);
    }).catch(console.error);
};

getDataRps().then(dataPM);

setInterval(() => {
    getDataRps().then(dataPM);
},60000);

