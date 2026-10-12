
export async function verifierReponse(urlAxios) {
    try{
        const result = await urlAxios();
        const requete = result.data;

        console.log("REQUETE OBTENUS: ", requete)

        // if (requete.response){
        //     return {data : requete.response.data, error : null, statut : requete.response.statut , message :requete.response.message }
        // }
        // if (requete.error){
        //     return {data : null, error : requete.error.trace, statut : requete.error.statut , message :requete.error.message }
        // }
        return requete;
    }
    catch(erreur){
        console.log("ERREUR INTERNE: ", erreur.response)
        return erreur;
        // return {data : null, error : code, statut : "error" , message : "Problème Serveur! Antsoy i TINA ijery anazy akaiky" }
    } 
}