export const fetchData = async () => {
    //const token = "TON_JETON_Ici";
    
    try {
        const response = await fetch("http://localhost:88/api/users?page=1", {
            method: "GET",
            //headers: {
            //    "Content-Type": "application/json",
            //    "Authorization": `Bearer ${token}`
            //}
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Erreur :", error);
    }
};