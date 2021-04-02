
function generateSelect() {
    const provinsiDropDown = document.getElementById("provinsi")
    const kotaDropdown = document.getElementById("kota")
    var lokasi = []
    fetch('/data-lokasi')
        .then(response => response.json())
        .then(data => {
            appendOptions(provinsiDropDown, 'provinsi', data)
            lokasi = data
        })

    provinsiDropDown.addEventListener('change', (event) => {
        let provinsiIndex = provinsiDropDown.value
        let kota = lokasi[provinsiIndex]['kota']
        console.log(kota)
        appendOptions(kotaDropdown, 'kota', kota)
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
async function fetchStatus(provinsiDropDown,kotaDropdown){
    let hasil = await fetch('/status-lokasi',{
        method:'POST',
        headers:{
            "Content-Type":"application/json;charset=utf-8"
        },
        body:JSON.stringify({
            lokasi:{
                provinsi: provinsiDropDown.options[provinsiDropDown.selectedIndex].text,
                kota: kotaDropdown.options[kotaDropdown.selectedIndex].text,
            }
        })
        
    })
    return hasil
}
async function getStatus(){
    const form = document.querySelector("form")
    const provinsiDropDown = document.getElementById("provinsi")
    const kotaDropdown = document.getElementById("kota")
    form.addEventListener('submit', async (event)=>{
        event.preventDefault()
        let hasil = await fetchStatus(provinsiDropDown,kotaDropdown)
        hasil.json().then(res=>{
            document.getElementById("status").innerText = res.status
            var waktu = ""
            if(res.status){
                if(res.status == "Hidup"){
                    waktu = "Jika merasa ada gangguan, kamu bisa restart ulang router. Jika masih tidak bisa, telepon CS kami"
                }
                if(res.status == "Perbaikan Ringan"){
                    waktu = "Sabar sebentar ya, 1-5 menit lagi nyala kok"
                }
                if(res.status == "Perbaikan Berat"){
                    waktu = "Wah bisa selesai 20-60 menit lagi nih, maafkan yaa, kamu bisa dapat paket bonus tolkemsel lewat kupon: INDOHOMELEBIHBAIK"
                }
                if(res.status == "Dinonaktifkan Sementara"){
                    waktu = "Di daerahmu, jaringan kami dinonaktifkan untuk waktu yang tidak bisa ditentukan"
                if(res.status == "Mati"){
                    waktu="Jaringan di daerahmu dimatikan, untuk berhenti dari layanan harap menghubungi cs"
                }
            }
            document.getElementById("waktu").innerText = waktu
                    
            }
        })
    })
}

async function main() {
    generateSelect()
    getStatus()
    
}
window.onload = main