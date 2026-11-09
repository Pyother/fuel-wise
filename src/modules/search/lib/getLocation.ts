export async function getLocation() {

    if (!navigator.geolocation) {
        new Error('Geolokalizacja nie jest wspierana przez Twoją przeglądarkę.');
        return;
    }

    
}