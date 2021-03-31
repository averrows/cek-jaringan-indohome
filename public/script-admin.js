function getData(table, provinsi) {
    fetch('/data-perProvinsi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(
            { provinsi: provinsi }
        )
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let first = table.childNodes[2];
            while (first) {
                first.remove();
                first = table.childNodes[2];
            }
            for (let i = 0; i < data.length; i++) {
                appendTable(table, data[i].provinsi, data[i].kota, data[i].status)
            }
            
        })
}

function generateProvinsiSelect() {
    const dataTable = document.getElementById("data-status")
    const provinsiDropDown = document.getElementById("provinsi")
    fetch('/data-lokasi')
        .then(response => response.json())
        .then(data => {
            appendOptions(provinsiDropDown, 'provinsi', data)
        })

    provinsiDropDown.addEventListener('change', (event) => {
        getData(dataTable, provinsiDropDown.options[provinsiDropDown.selectedIndex].text)
    })


}

function appendOptions(parent, optionType, data) {
    //hapus dropdown yang sudah ada
    let first = parent.firstElementChild;
    while (first) {
        first.remove();
        first = parent.firstElementChild;
    }
    //cek data
    if (data.length == 0) {
        console.log("data Kosong")
    } else {
        console.log("data ada")
        //jika data ada lakukan iterasi untuk melakukan 
        const altSelect = document.createElement("option")
        altSelect.innerText = "-- Pilih Opsi --"
        parent.appendChild(altSelect)
        for (let i = 0; i < data.length; i++) {
            const select = document.createElement("option")
            select.value = i
            if (optionType == 'provinsi') {
                select.innerText = data[i][optionType]
            } else {
                select.innerText = data[i]
            }
            parent.appendChild(select)
        }
    }
}

function appendTable(parent, provinsi, kota, status) {

    const dataBaru = document.createElement("tr")
    const dataBaruProvinsi = document.createElement("td")
    dataBaruProvinsi.innerText = provinsi
    dataBaru.appendChild(dataBaruProvinsi)
    const dataBaruKota = document.createElement("td")
    dataBaruKota.innerText = kota
    dataBaru.appendChild(dataBaruKota)
    const dataBaruStatus = document.createElement("td")
    dataBaruStatus.innerText = status
    dataBaru.appendChild(dataBaruStatus)
    const selectGantiStatus = document.createElement("select")
    const pilihan = ["Hidup","Mati","Perbaikan Ringan","Perbaikan Berat","Dinonaktifkan Sementara"]
    appendOptions(selectGantiStatus,'pilihanStatus',pilihan)
    const opsiPerubahan = document.createElement("td")
    opsiPerubahan.appendChild(selectGantiStatus)
    dataBaru.appendChild(opsiPerubahan)
    dataBaruStatus.id = provinsi + kota
    selectGantiStatus.addEventListener('change',(event)=>{
        event.preventDefault()
        // const buttonUbah = document.createElement("button")
        // buttonUbah.className = "buttonUbah"
        // buttonUbah.innerHTML = "Lakukan Perubahan"
        // buttonUbah.type = 'submit'
        // if(parent.lastElementChild.className != "buttonUbah"){
        //     parent.appendChild(buttonUbah)
        // }
        fetch('/ubah-status',{
            method:'PUT',
            headers:{
                "Content-Type":'application/json;charset=utf-8'
            },
            body:JSON.stringify(
                {
                    lokasi:{
                        provinsi:provinsi,
                        kota:kota
                    },
                    statusBaru:selectGantiStatus.options[selectGantiStatus.selectedIndex].text
                }
            )
        }).then(res=>{
            document.getElementById(provinsi+kota).innerText = selectGantiStatus.options[selectGantiStatus.selectedIndex].text
        })
    })
    parent.appendChild(dataBaru)
    


}



function main() {
    generateProvinsiSelect()
}

window.onload = main